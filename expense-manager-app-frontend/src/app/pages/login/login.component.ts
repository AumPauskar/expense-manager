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
    template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
      <ui-card class="w-full max-w-sm">
        <ui-card-header>
          <ui-card-title class="text-2xl">Login</ui-card-title>
          <ui-card-description>Enter your credentials to access your account.</ui-card-description>
        </ui-card-header>
        <ui-card-content class="grid gap-4">
          <div class="grid gap-2">
            <ui-input placeholder="Username" [(ngModel)]="username"></ui-input>
          </div>
          <div class="grid gap-2">
            <ui-input type="password" placeholder="Password" [(ngModel)]="password"></ui-input>
          </div>
          <div *ngIf="error" class="text-sm text-red-500">{{ error }}</div>
        </ui-card-content>
        <ui-card-footer class="flex flex-col gap-2">
          <ui-button class="w-full" (click)="onLogin()">Sign in</ui-button>
          <ui-button variant="link" class="w-full" (click)="goToRegister()">Don't have an account? Sign up</ui-button>
        </ui-card-footer>
      </ui-card>
    </div>
  `,
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
