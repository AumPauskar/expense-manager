terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Random string for unique naming
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# Security Groups
resource "aws_security_group" "lambda_sg" {
  name        = "${var.project_name}-lambda-sg-${random_string.suffix.result}"
  description = "Security group for Lambda function"
  vpc_id      = data.aws_vpc.default.id

  # Allow outbound to anywhere (needed to reach RDS and internet)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db_sg" {
  name        = "${var.project_name}-db-sg-${random_string.suffix.result}"
  description = "Security group for RDS instance"
  vpc_id      = data.aws_vpc.default.id

  # Allow inbound from Lambda SG
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]
  }
}

# RDS Instance (Free Tier)
resource "aws_db_instance" "default" {
  identifier           = "${var.project_name}-db-${random_string.suffix.result}"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "16.3" # Check for latest free tier supported version
  instance_class       = "db.t3.micro"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres16"
  skip_final_snapshot  = true
  publicly_accessible  = false # Keep it private, only accessible by Lambda
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

# Lambda Function (Inner - Private, .NET)
resource "aws_lambda_function" "inner" {
  filename      = "../expense-manager-app-backend/ExpenseManagerApp.Api/bin/Release/net10.0/publish/ExpenseManagerApp.Api.zip"
  function_name = "${var.project_name}-inner-${random_string.suffix.result}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "ExpenseManagerApp.Api"
  runtime       = "dotnet10"
  timeout       = 30
  memory_size   = 512

  # VPC Configuration to access RDS
  vpc_config {
    subnet_ids         = data.aws_subnets.default.ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      ConnectionStrings__DefaultConnection = "Host=${aws_db_instance.default.address};Port=5432;Database=expensedb;Username=${var.db_username};Password=${var.db_password}"
    }
  }

  depends_on = [aws_db_instance.default]
}

# Lambda Function (Outer - Proxy, Node.js)
resource "aws_lambda_function" "proxy" {
  filename      = "proxy.zip" 
  function_name = "${var.project_name}-proxy-${random_string.suffix.result}"
  role          = aws_iam_role.proxy_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  
  # No VPC Config -> Runs on Public Internet

  environment {
    variables = {
      INNER_FUNCTION_NAME = aws_lambda_function.inner.function_name
    }
  }
}

# Zip the inline proxy code
data "archive_file" "proxy_zip" {
  type        = "zip"
  output_path = "proxy.zip"
  
  source {
    filename = "index.mjs"
    content  = <<EOF
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const client = new LambdaClient({});

export const handler = async (event) => {
  const command = new InvokeCommand({
    FunctionName: process.env.INNER_FUNCTION_NAME,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify(event),
  });

  const { Payload } = await client.send(command);
  const result = Buffer.from(Payload).toString();

  return JSON.parse(result);
};
EOF
  }
}

# IAM Role for Inner Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-inner-role-${random_string.suffix.result}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# IAM Policy Attachment for VPC Access (Inner)
resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# IAM Role for Proxy Lambda
resource "aws_iam_role" "proxy_exec" {
  name = "${var.project_name}-proxy-role-${random_string.suffix.result}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# IAM Policy to Invoke Inner Lambda
resource "aws_iam_policy" "proxy_invoke_policy" {
  name        = "${var.project_name}-proxy-invoke-${random_string.suffix.result}"
  description = "Allow proxy to invoke inner lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "lambda:InvokeFunction"
        Effect = "Allow"
        Resource = aws_lambda_function.inner.arn
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "proxy_invoke_attach" {
  role       = aws_iam_role.proxy_exec.name
  policy_arn = aws_iam_policy.proxy_invoke_policy.arn
}


# API Gateway (HTTP API) - Points to Proxy
resource "aws_apigatewayv2_api" "api" {
  name          = "${var.project_name}-api-${random_string.suffix.result}"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"] # Restrict this to your GitHub Pages URL in production
    allow_methods = ["*"]
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.proxy.invoke_arn # Points to PROXY
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "any" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Permission for API Gateway to invoke Proxy Lambda
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.proxy.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

# Outputs
output "api_endpoint" {
  value = aws_apigatewayv2_api.api.api_endpoint
}

output "db_endpoint" {
  value = aws_db_instance.default.endpoint
}
