import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExpenseService, Expense } from '../../services/expense.service';
import { DateService } from '../../services/date.service';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';
import { UiCardComponent, UiCardContentComponent, UiCardDescriptionComponent, UiCardHeaderComponent, UiCardTitleComponent } from '../../components/ui/card.component';
import { UiButtonComponent } from '../../components/ui/button.component';
import { FormsModule } from '@angular/forms';
import { UiInputComponent } from '../../components/ui/input.component';
import { HlmPaginationImports } from '../../components/ui/pagination/src';
import { StatsCardsComponent } from '../../components/stats-cards/stats-cards.component';

import { toast } from 'ngx-sonner';

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
    DatePipe,
    HlmPaginationImports,
    StatsCardsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  currentDate = new Date();
  username = '';

  newExpense: Partial<Expense> = {};
  currencyCode = 'USD';

  // Pagination
  currentPage = 1;
  pageSize = 10;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dateService: DateService,
    private settingsService: SettingsService
  ) {
    this.resetNewExpense();
  }



  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;
    console.log('Dashboard initialized');

    // Listen to settings changes
    this.settingsService.settings$.subscribe(settings => {
      this.currencyCode = settings.currencyCode;
      this.pageSize = settings.pageSize;
      this.currentPage = 1; // Reset to first page when settings change
    });

    // Listen to global date changes
    this.dateService.currentDate$.subscribe(date => {
      this.currentDate = date;
      this.loadExpenses();
    });

    // Listen to expense changes (cached or new)
    this.expenseService.expenses$.subscribe(data => {
      this.expenses = data;
      this.cdr.detectChanges();
    });
  }

  loadExpenses() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1; // 1-indexed
    this.expenseService.getMonthlyExpenses(year, month).subscribe();
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
        toast.success('Expense added successfully!');
        // Clear form
        this.resetNewExpense();
      },
      error: (err) => {
        toast.error('Failed to add expense');
        console.error(err);
      }
    });
  }

  resetNewExpense() {
    const settings = this.settingsService.settings;
    this.newExpense = {
      name: '',
      transactionAmount: 0,
      required: settings.defaultRequired,
      cash: settings.defaultCash,
      spent: settings.defaultSpent
    };
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
      // If not spent (Earned), required should be false by default
      this.newExpense.required = false;
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

  // Pagination Helpers
  get paginatedExpenses(): Expense[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.expenses.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.expenses.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  getVisiblePages(): number[] {
    const total = this.totalPages || 1;
    const current = this.currentPage;
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1); // -1 indicates ellipsis
    }
    if (current + delta < total - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (total !== 1) {
      range.push(total);
    }

    return range; // Return full range including -1 for ellipsis
  }
}
