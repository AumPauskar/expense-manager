import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DateService } from '../../services/date.service';
import { ExpenseService, Expense } from '../../services/expense.service';
import { UiCardComponent, UiCardContentComponent, UiCardHeaderComponent, UiCardTitleComponent } from '../../components/ui/card.component';


@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardContentComponent,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="space-y-8">
       <div>
        <h2 class="text-3xl font-bold tracking-tight">Metrics</h2>
        <p class="text-muted-foreground">Financial overview for {{ currentDate | date:'MMMM yyyy' }}</p>
      </div>

      <!-- Stats Cards (Same as Dashboard) -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ui-card>
          <ui-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <ui-card-title class="text-sm font-medium">Total Spent</ui-card-title>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </ui-card-header>
          <ui-card-content>
            <div class="text-2xl font-bold text-red-600">{{ totalSpent | currency }}</div>
            <p class="text-xs text-muted-foreground">Actual expenses</p>
          </ui-card-content>
        </ui-card>

        <ui-card>
          <ui-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <ui-card-title class="text-sm font-medium">Total Earned</ui-card-title>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-muted-foreground"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 20 20"/><path d="m8 8 4 4 2-2"/></svg>
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

      <div class="grid gap-4 md:grid-cols-2">
        <!-- Total Spent (Week Wise) -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Total Spent (Week Wise)</ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <canvas baseChart
              [data]="spentWeekWiseData"
              [options]="barChartOptions"
              [type]="'bar'">
            </canvas>
          </ui-card-content>
        </ui-card>

        <!-- Total Earned (Week Wise) -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Total Earned (Week Wise)</ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <canvas baseChart
              [data]="earnedWeekWiseData"
              [options]="barChartOptions"
              [type]="'bar'">
            </canvas>
          </ui-card-content>
        </ui-card>

        <!-- Spent This Week (Day Wise) -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Spent This Week</ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <canvas baseChart
              [data]="spentThisWeekData"
              [options]="barChartOptions"
              [type]="'bar'">
            </canvas>
          </ui-card-content>
        </ui-card>

        <!-- Average Daily (Week Wise) -->
        <ui-card>
          <ui-card-header>
             <ui-card-title>Average Daily (Week Wise)</ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <canvas baseChart
              [data]="averageDailyData"
              [options]="lineChartOptions"
              [type]="'line'">
            </canvas>
          </ui-card-content>
        </ui-card>
      </div>
    </div>
  `
})
export class MetricsComponent implements OnInit {
  currentDate = new Date();
  expenses: Expense[] = [];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: {}, y: { min: 0 } },
    plugins: {
      legend: { display: true },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value: any) => value > 0 ? '$' + value.toFixed(2) : '',
        font: { weight: 'bold' }
      }
    }
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: { line: { tension: 0.4 } },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value: any) => value > 0 ? '$' + value.toFixed(2) : '',
        font: { weight: 'bold' }
      }
    }
  };

  // Data Sources
  spentWeekWiseData: ChartData<'bar'> = { labels: [], datasets: [] };
  earnedWeekWiseData: ChartData<'bar'> = { labels: [], datasets: [] };
  spentThisWeekData: ChartData<'bar'> = { labels: [], datasets: [] };
  averageDailyData: ChartData<'line'> = { labels: [], datasets: [] };

  constructor(
    private dateService: DateService,
    private expenseService: ExpenseService
  ) {
    Chart.register(ChartDataLabels);
  }

  ngOnInit() {
    this.dateService.currentDate$.subscribe(date => {
      this.currentDate = date;
      this.loadData();
    });

    this.expenseService.expenses$.subscribe(expenses => {
      this.expenses = expenses;
      this.processData();
    });
  }

  loadData() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    this.expenseService.getMonthlyExpenses(year, month).subscribe();
  }

  processData() {
    // Helper to get week number of the month (1-5)
    const getWeekOfMonth = (date: Date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const dayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
      // Adjust for Monday start if needed, but simple approximation:
      return Math.ceil((date.getDate() + dayOfWeek) / 7);
    };

    // Initialize buckets
    const weeks: { [key: number]: number } = {};
    const earnedWeeks: { [key: number]: number } = {};
    const weekCounts: { [key: number]: number } = {}; // days with expenses? or just 7 days per week?

    // For "Spent This Week"
    const today = new Date();
    // Start of current week (Monday)
    const day = today.getDay();
    const diff = today.getDate() - (day === 0 ? 6 : day - 1);
    const startOfThisWeek = new Date(today.getFullYear(), today.getMonth(), diff);
    // Only if displaying current month? Or logic says "Metrics" for the selected month?
    // User requirement: "spent this week (day wise)". Usually implies *current* week regardless of selected month, or week within selected month?
    // "Metrics" page usually reflects the "selected context" (Header date). 
    // But "Spent this week" strongly suggests real-time "This Week".
    // I'll assume "This Week" means the week containing "Today", IF "Today" is in the selected month, OR the first week of selected month?
    // Let's stick to "This Week" = the week relative to `currentDate` (the selected date). 
    // IF selected date is Month X, "This Week" might be ambiguous. 
    // Let's interpret "metrics page should use the 4 graphs... spent this week (day wise)". 
    // If I select "January 2025" and today is "Feb 2026", "Spent this week" might mean "Spent in the first week of Jan 2025" or "Spent in the week containing selected date"?
    // Dashboard had "Spent This Week" logic which checked `isCurrentMonth`.
    // I'll follow Dashboard logic: If selected month != current real month, maybe show empty or just show data for the first week?
    // Actually, "Spent This Week" usually refers to the *calendar* week of the selected date. 
    // Let's assume we show the breakdown of the days (Mon-Sun) for the week that includes the `currentDate` (which defaults to today, but can be changed).
    // The `DateService` updates `currentDate` but only Month/Year. The `getDate()` component stays same or resets? `changeMonth` sets month.
    // If I change month, `currentDate` preserves the day (e.g. 10th Jan -> 10th Feb), unless overflow.
    // So I can use the week containing `currentDate`.

    // Data Aggregation
    const weeklySpent: Record<string, number> = {}; // "Week 1", "Week 2"
    const weeklyEarned: Record<string, number> = {};
    const dailySpentThisWeek: Record<string, number> = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

    // Initialize weeks 1-5
    for (let i = 1; i <= 5; i++) {
      weeklySpent[`Week ${i}`] = 0;
      weeklyEarned[`Week ${i}`] = 0;
    }

    // Determine week of currentDate for "Spent This Week"
    const currentWeekNum = getWeekOfMonth(this.currentDate);
    // Actually "Spent This Week (Day Wise)" implies Mon-Sun labels.
    // I need to filter expenses that fall in the same week as `this.currentDate`.

    // Calculate start/end of the week for `this.currentDate`
    const d = new Date(this.currentDate);
    const currentDay = d.getDay(); // 0-6
    const dist = d.getDate() - (currentDay === 0 ? 6 : currentDay - 1); // Monday
    const weekStart = new Date(d.getFullYear(), d.getMonth(), dist);
    const weekEnd = new Date(d.getFullYear(), d.getMonth(), dist + 6);
    // Reset hours
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);

    this.expenses.forEach(e => {
      const eDate = new Date(e.date);
      const w = getWeekOfMonth(eDate);

      if (e.spent) {
        weeklySpent[`Week ${w}`] = (weeklySpent[`Week ${w}`] || 0) + e.transactionAmount;

        // Check if in "current week" of the view
        if (eDate >= weekStart && eDate <= weekEnd) {
          const dayName = eDate.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
          if (dailySpentThisWeek[dayName] !== undefined) {
            dailySpentThisWeek[dayName] += e.transactionAmount;
          }
        }
      } else {
        weeklyEarned[`Week ${w}`] = (weeklyEarned[`Week ${w}`] || 0) + e.transactionAmount;
      }
    });

    // 1. Total Spent (Week Wise)
    this.spentWeekWiseData = {
      labels: Object.keys(weeklySpent),
      datasets: [{ data: Object.values(weeklySpent), label: 'Spent', backgroundColor: '#e11d48' }]
    };

    // 2. Total Earned (Week Wise)
    this.earnedWeekWiseData = {
      labels: Object.keys(weeklyEarned),
      datasets: [{ data: Object.values(weeklyEarned), label: 'Earned', backgroundColor: '#16a34a' }]
    };

    // 3. Spent This Week (Day Wise)
    // Ensure order Mon -> Sun
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const thisWeekData = daysOrder.map(day => dailySpentThisWeek[day]);

    this.spentThisWeekData = {
      labels: daysOrder,
      datasets: [{ data: thisWeekData, label: 'Spent This Week', backgroundColor: '#2563eb' }]
    };

    // 4. Average Daily (Week Wise)
    // Simply Total Spending in Week / 7 (or days passed?)
    // "Average daily (week wise)" -> X axis: Week 1..5, Y axis: Average spent per day in that week.
    const averageDaily = Object.keys(weeklySpent).map(key => {
      const total = weeklySpent[key];
      // Ideally divide by number of days in that week (usually 7, but first/last week might differ)
      // For simplicity divide by 7 or approximations.
      return total / 7;
    });

    this.averageDailyData = {
      labels: Object.keys(weeklySpent),
      datasets: [{ data: averageDaily, label: 'Avg Daily Spending', borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.2)', fill: true, tension: 0.4 }]
    };
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

  get spentThisWeek(): number {
    const today = new Date();
    if (!this.isCurrentMonth(this.currentDate)) return 0;

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
      days = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    }

    return this.totalSpent / (days || 1);
  }

  private isCurrentMonth(d: Date): boolean {
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }
}
