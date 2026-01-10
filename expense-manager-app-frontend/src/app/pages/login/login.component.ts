import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiCardComponent, UiCardContentComponent, UiCardDescriptionComponent, UiCardFooterComponent, UiCardHeaderComponent, UiCardTitleComponent } from '../../components/ui/card.component';
import { UiInputComponent } from '../../components/ui/input.component';
import { UiButtonComponent } from '../../components/ui/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiCardFooterComponent,
    UiInputComponent,
    UiButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Invalid credentials or error occurred.';
        console.error(err);
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
