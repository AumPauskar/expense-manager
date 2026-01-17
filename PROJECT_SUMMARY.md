# Project Summary: Expense Manager

## Quick Info
- **Type**: Full-stack Web Application
- **Core Purpose**: Personal finance tracking with monthly metrics and dashboard.
- **Primary Stack**: .NET 10 (API) + Angular 21 (SPA) + PostgreSQL 16 (DB).

## System Architecture
- **Backend**: Clean Architecture (.Domain, .Application, .Infrastructure, .Api). 
- **Frontend**: Component-based with a custom UI system (Shadcn-like). Modular routing.
- **Deployment**: 
  - **AWS Lambda**: Serverless backend hosting.
  - **RDS**: Managed PostgreSQL.
  - **Terraform**: Infrastructure-as-Code for all AWS resources.
  - **GitHub Actions**: Automated CI/CD for both frontend and backend.

## Key Modules
- `expense-manager-app-backend`: Core business logic, API endpoints, EF Core migrations.
- `expense-manager-app-frontend`: Angular application, UI components, state management (services).
- `infrastructure`: Terraform scripts defining VPC, Security Groups, Lambda roles, and RDS.

## Core Features
1. **User Authentication**: Simple account registration and login.
2. **Dashboard**: High-level spending summary cards.
3. **Metrics Page**: Monthly breakdown of expenses.
4. **Expense Entry**: Form-based entry with metadata (Cash/Card, Required/Discretionary).
5. **Real-time Notifications**: Toast notifications for user feedback.

## Developer Quicklinks
- **Local API**: `http://localhost:5037`
- **Local UI**: `http://localhost:4200`
- **Database**: Local Docker Postgres (Port 5432)
