import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExpenseService, Expense } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { UiCardComponent, UiCardContentComponent, UiCardDescriptionComponent, UiCardHeaderComponent, UiCardTitleComponent } from '../../components/ui/card.component';
import { UiButtonComponent } from '../../components/ui/button.component';
import { FormsModule } from '@angular/forms';
import { UiInputComponent } from '../../components/ui/input.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UiCardComponent, // Modules
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiButtonComponent,
    UiInputComponent,
    FormsModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="min-h-screen bg-background p-6 space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p class="text-muted-foreground">Welcome back, {{ username }}</p>
        </div>
        <div class="flex items-center gap-2">
            <!-- Theme Toggle -->
            <div class="flex items-center border rounded-md p-1 bg-card mr-2">
              <button
                (click)="setTheme('light')"
                [class.text-primary]="currentTheme() === 'light'"
                [class.text-muted-foreground]="currentTheme() !== 'light'"
                class="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Light Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 22v2"/><path d="M20 12h2"/><path d="M2 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M19.07 19.07l-1.41-1.41"/><path d="M4.93 19.07l1.41-1.41"/><path d="M4.93 4.93l1.41 1.41"/></svg>
              </button>
              <button
                (click)="setTheme('dark')"
                [class.text-primary]="currentTheme() === 'dark'"
                [class.text-muted-foreground]="currentTheme() !== 'dark'"
                class="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Dark Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </button>
              <button
                (click)="setTheme('system')"
                [class.text-primary]="currentTheme() === 'system'"
                [class.text-muted-foreground]="currentTheme() !== 'system'"
                class="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="System Theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
              </button>
            </div>

          <div class="flex items-center gap-2 bg-card border rounded-md p-1">
             <button class="px-2" (click)="changeMonth(-1)">←</button>
             <span class="font-medium">{{ currentDate | date:'MMMM yyyy' }}</span>
             <button class="px-2" (click)="changeMonth(1)">→</button>
          </div>
          <ui-button (click)="logout()" variant="outline">Logout</ui-button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ui-card>
          <ui-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <ui-card-title class="text-sm font-medium">Total Spent</ui-card-title>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              class="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </ui-card-header>
          <ui-card-content>
            <div class="text-2xl font-bold text-red-600">{{ totalSpent | currency }}</div>
            <p class="text-xs text-muted-foreground">Actual expenses</p>
          </ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <ui-card-title class="text-sm font-medium">Total Earned</ui-card-title>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              class="h-4 w-4 text-muted-foreground"
            >
              <path d="m12 19 7-7 3 3-7 7-3-3z"/>
              <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="m2 2 20 20"/>
              <path d="m8 8 4 4 2-2"/>
            </svg>
          </ui-card-header>
          <ui-card-content>
            <div class="text-2xl font-bold text-green-600">{{ totalEarned | currency }}</div>
            <p class="text-xs text-muted-foreground">Total income</p>
          </ui-card-content>
        </ui-card>
        <ui-card>
          <ui-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <ui-card-title class="text-sm font-medium">Spent This Week</ui-card-title>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-muted-foreground"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          </ui-card-header>
          <ui-card-content>
            <div class="text-2xl font-bold">{{ spentThisWeek | currency }}</div>
            <p class="text-xs text-muted-foreground">Mon - Today</p>
          </ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <ui-card-title class="text-sm font-medium">Average Daily</ui-card-title>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-muted-foreground"><path d="M12 2v20"/><path d="M21 12H3"/><circle cx="12" cy="12" r="10"/></svg>
          </ui-card-header>
          <ui-card-content>
            <div class="text-2xl font-bold">{{ averageSpent | currency }}</div>
            <p class="text-xs text-muted-foreground">Per day this month</p>
          </ui-card-content>
        </ui-card>
      </div>

      <!-- Add Expense Form (Simple inline for now) -->
      <ui-card>
        <ui-card-header>
           <ui-card-title>Add New Expense</ui-card-title>
        </ui-card-header>
        <ui-card-content class="flex flex-col md:flex-row gap-4 items-end">
           <div class="grid gap-2 w-full">
             <label class="text-sm font-medium">Name</label>
             <ui-input placeholder="Grocery" [(ngModel)]="newExpense.name"></ui-input>
           </div>
           <div class="grid gap-2 w-full">
             <label class="text-sm font-medium">Amount</label>
             <ui-input type="number" placeholder="0.00" [(ngModel)]="newExpense.transactionAmount"></ui-input>
           </div>
            <div class="flex items-center gap-2 pb-2">
               <!-- Checkboxes mimicking shadcn switch/checkbox roughly -->
               <label class="flex items-center gap-2 text-sm" [class.opacity-50]="!newExpense.spent">
                 <input type="checkbox" [(ngModel)]="newExpense.required" [disabled]="!newExpense.spent" class="accent-primary rounded" /> Required
               </label>
               <label class="flex items-center gap-2 text-sm">
                 <input type="checkbox" [(ngModel)]="newExpense.cash" class="accent-primary rounded" /> Cash
               </label>
               <label class="flex items-center gap-2 text-sm">
                 <input type="checkbox" [(ngModel)]="newExpense.spent" (ngModelChange)="onSpentChange($event)" class="accent-primary rounded" /> Spent
               </label>
            </div>
           <ui-button (click)="addExpense()">Add</ui-button>
        </ui-card-content>
      </ui-card>

      <!-- Expense List -->
      <ui-card>
         <ui-card-header>
            <ui-card-title>Recent Expenses</ui-card-title>
            <ui-card-description>A list of your recent transactions.</ui-card-description>
         </ui-card-header>
         <ui-card-content>
            <div class="rounded-md border">
              <table class="w-full text-sm text-left">
                <thead class="bg-muted/50 text-muted-foreground">
                  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th class="h-12 px-4 align-middle font-medium">Date</th>
                    <th class="h-12 px-4 align-middle font-medium">Name</th>

                     <th class="h-12 px-4 align-middle font-medium">Type</th>
                    <th class="h-12 px-4 align-middle font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let expense of expenses" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td class="p-4 align-middle">{{ expense.date | date:'mediumDate' }}</td>
                    <td class="p-4 align-middle font-medium">{{ expense.name }}</td>

                    <td class="p-4 align-middle">{{ expense.cash ? 'Cash' : 'Online' }}</td>
                    <td class="p-4 align-middle text-right"
                        [ngClass]="{
                          'text-red-600': expense.spent && !expense.required,
                          'text-green-600': !expense.spent,
                          'text-amber-600': expense.spent && expense.required
                        }">
                      {{ expense.transactionAmount | currency }}
                    </td>
                  </tr>
                   <tr *ngIf="expenses.length === 0">
                      <td colspan="4" class="p-4 text-center text-muted-foreground">No expenses found for this month.</td>
                   </tr>
                </tbody>
              </table>
            </div>
         </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  currentDate = new Date();
  username = '';

  newExpense: Partial<Expense> = {
    name: '',
    transactionAmount: 0,
    required: true,
    cash: false,
    spent: true
  };

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public themeService: ThemeService
  ) { }

  get currentTheme() {
    return this.themeService.currentTheme;
  }

  setTheme(t: Theme) {
    this.themeService.setTheme(t);
  }

  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;
    console.log('Dashboard initialized, loading expenses for', this.username);
    this.loadExpenses();
  }

  loadExpenses() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1; // 1-indexed
    this.expenseService.getMonthlyExpenses(year, month).subscribe({
      next: (data) => {
        console.log('Expenses loaded:', data);
        this.expenses = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading expenses:', err)
    });
  }

  changeMonth(delta: number) {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + delta));
    this.loadExpenses();
  }

  addExpense() {
    if (!this.newExpense.name || !this.newExpense.transactionAmount) return;

    const expense: Expense = {
      ...this.newExpense as Expense,
      accountId: this.authService.currentUserValue!.id,
      date: new Date().toISOString()
    };

    // If expense date should be in the currently selected month? 
    // Usually user adds expense for today. If viewing past month, this might be confusing.
    // We will stick to "Today" for new expenses for now.

    this.expenseService.addExpense(expense).subscribe({
      next: (res) => {
        // Clear form
        this.newExpense = {
          name: '',
          transactionAmount: 0,
          required: true,
          cash: false,
          spent: true
        };
        // Refresh list if current month is "this month"
        if (this.isCurrentMonth(this.currentDate)) {
          this.expenses = [...this.expenses, res];
          this.cdr.detectChanges();
        } else {
          // Ideally navigate to current month or show toast
        }
      },
      error: (err) => console.error(err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private isCurrentMonth(d: Date): boolean {
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }

  get totalSpent(): number {
    return this.expenses
      .filter(e => e.spent)
      .reduce((sum, e) => sum + e.transactionAmount, 0);
  }

  get totalEarned(): number {
    return this.expenses
      .filter(e => !e.spent)
      .reduce((sum, e) => sum + e.transactionAmount, 0);
  }

  onSpentChange(isSpent: boolean) {
    if (!isSpent) {
      // If not spent (Pending), required must be true as per logic
      this.newExpense.required = true;
    }
  }

  get spentThisWeek(): number {
    const today = new Date();
    if (!this.isCurrentMonth(this.currentDate)) return 0;

    // Start of week (Monday)
    const day = today.getDay();
    const diff = today.getDate() - (day === 0 ? 6 : day - 1);
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), diff, 0, 0, 0);

    return this.expenses
      .filter(e => e.spent && new Date(e.date) >= startOfWeek)
      .reduce((sum, e) => sum + e.transactionAmount, 0);
  }

  get averageSpent(): number {
    if (this.expenses.length === 0) return 0;
    const today = new Date();
    const isCurrent = this.isCurrentMonth(this.currentDate);

    let days: number;
    if (isCurrent) {
      days = today.getDate();
    } else {
      const isFuture = this.currentDate > today;
      if (isFuture) return 0;

      // Elapsed month: get days in that month
      days = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    }

    return this.totalSpent / (days || 1);
  }
}
