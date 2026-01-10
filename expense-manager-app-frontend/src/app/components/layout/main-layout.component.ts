import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { DateService } from '../../services/date.service';
import { UiButtonComponent } from '../ui/button.component';
import { LucideAngularModule, Sun, Moon, Laptop } from 'lucide-angular';
import { HlmNavigationMenuImports } from '../ui/navigation-menu/src';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        UiButtonComponent,
        DatePipe,
        LucideAngularModule,
        ...HlmNavigationMenuImports
    ],
    template: `
    <div class="min-h-screen bg-background p-6 space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between border-b pb-4">
        <div class="flex items-center gap-6">
          <h1 class="text-2xl font-bold tracking-tight">Expense Manager</h1>
          
          <!-- Navigation Menu -->
          <nav hlmNavigationMenu>
            <ul hlmNavigationMenuList class="flex items-center gap-1">
             <li hlmNavigationMenuItem>
               <a hlmNavigationMenuLink routerLink="/dashboard" routerLinkActive="bg-accent text-accent-foreground" class="w-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                 Dashboard
               </a>
             </li>
             <li hlmNavigationMenuItem>
                <a hlmNavigationMenuLink routerLink="/metrics" routerLinkActive="bg-accent text-accent-foreground" class="w-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Metrics
                </a>
             </li>
             <li hlmNavigationMenuItem>
                <a hlmNavigationMenuLink routerLink="/settings" routerLinkActive="bg-accent text-accent-foreground" class="w-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Settings
                </a>
             </li>
            </ul>
          </nav>
        </div>

        <div class="flex items-center gap-2">
           <!-- Theme Toggle -->
            <div class="flex items-center border rounded-md p-1 bg-card mr-2">
              <button (click)="setTheme('light')" [class.text-primary]="currentTheme() === 'light'" class="p-1.5 hover:bg-muted rounded-md transition-colors"><lucide-icon name="sun" size="16"></lucide-icon></button>
              <button (click)="setTheme('dark')" [class.text-primary]="currentTheme() === 'dark'" class="p-1.5 hover:bg-muted rounded-md transition-colors"><lucide-icon name="moon" size="16"></lucide-icon></button>
              <button (click)="setTheme('system')" [class.text-primary]="currentTheme() === 'system'" class="p-1.5 hover:bg-muted rounded-md transition-colors"><lucide-icon name="laptop" size="16"></lucide-icon></button>
            </div>

            <!-- Month Picker -->
           <div class="flex items-center gap-2 bg-card border rounded-md p-1">
             <button class="px-2 hover:bg-muted rounded" (click)="changeMonth(-1)">←</button>
             <span class="font-medium min-w-[100px] text-center">{{ currentDate$ | async | date:'MMMM yyyy' }}</span>
             <button class="px-2 hover:bg-muted rounded" (click)="changeMonth(1)">→</button>
           </div>

           <ui-button (click)="logout()" variant="outline" size="sm">Logout</ui-button>
        </div>
      </div>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
    currentDate$: Observable<Date>;

    constructor(
        public themeService: ThemeService,
        private authService: AuthService,
        private dateService: DateService
    ) {
        this.currentDate$ = this.dateService.currentDate$;
    }

    get currentTheme() {
        return this.themeService.currentTheme;
    }

    setTheme(t: Theme) {
        this.themeService.setTheme(t);
    }

    changeMonth(delta: number) {
        this.dateService.changeMonth(delta);
    }

    logout() {
        this.authService.logout();
        location.reload(); // Simple reload to clear state/redirect
    }
}
