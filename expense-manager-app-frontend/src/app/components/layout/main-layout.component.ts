import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { DateService } from '../../services/date.service';
import { ExpenseService } from '../../services/expense.service';
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
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  currentDate$: Observable<Date>;
  showMonthPicker$: Observable<boolean>;

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private dateService: DateService,
    private expenseService: ExpenseService,
    private router: Router
  ) {
    this.currentDate$ = this.dateService.currentDate$;
    this.showMonthPicker$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => !(event as NavigationEnd).urlAfterRedirects.includes('/settings')),
      startWith(!this.router.url.includes('/settings'))
    );

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
    this.expenseService.clearCache();
    this.authService.logout();
    location.reload();
  }
}
