import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiCardComponent, UiCardContentComponent, UiCardDescriptionComponent, UiCardFooterComponent, UiCardHeaderComponent, UiCardTitleComponent } from '../../components/ui/card.component';
import { UiInputComponent } from '../../components/ui/input.component';
import { UiButtonComponent } from '../../components/ui/button.component';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        // Auto login or redirect to login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Registration failed. Try a different username.';
        console.error(err);
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
