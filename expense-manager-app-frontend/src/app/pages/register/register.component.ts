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
    template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
      <ui-card class="w-full max-w-sm">
        <ui-card-header>
          <ui-card-title class="text-2xl">Create an account</ui-card-title>
          <ui-card-description>Enter your details to get started.</ui-card-description>
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
          <ui-button class="w-full" (click)="onRegister()">Create account</ui-button>
          <ui-button variant="link" class="w-full" (click)="goToLogin()">Already have an account? Sign in</ui-button>
        </ui-card-footer>
      </ui-card>
    </div>
  `,
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
