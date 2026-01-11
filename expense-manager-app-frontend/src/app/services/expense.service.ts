import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface Expense {
    id?: number;
    accountId: number;
    name: string;
    required: boolean;
    cash: boolean;
    spent: boolean;
    transactionAmount: number;
    date: string; // ISO string
}

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ExpenseService {
    private apiUrl = environment.apiUrl + '/Expense';

    private expensesSubject = new BehaviorSubject<Expense[]>([]);
    expenses$ = this.expensesSubject.asObservable();
    private lastCacheKey = '';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const user = this.authService.currentUserValue;
        let headers = new HttpHeaders();
        if (user) {
            headers = headers.set('X-Account-Id', user.id.toString());
        }
        return headers;
    }

    getMonthlyExpenses(year: number, month: number): Observable<Expense[]> {
        const cacheKey = `${year}-${month}`;

        // If we already have the data for this month, return the current subject value
        if (this.lastCacheKey === cacheKey) {
            return of(this.expensesSubject.value);
        }

        return this.http.get<Expense[]>(`${this.apiUrl}/${year}/${month}`, {
            headers: this.getHeaders(),
        }).pipe(
            tap(data => {
                this.lastCacheKey = cacheKey;
                this.expensesSubject.next(data);
            })
        );
    }

    addExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(this.apiUrl, expense, {
            headers: this.getHeaders(),
        }).pipe(
            tap(newExpense => {
                // Refresh local state if it's the same month
                const expenseDate = new Date(newExpense.date);
                const cacheKey = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`;
                if (this.lastCacheKey === cacheKey) {
                    const current = this.expensesSubject.value;
                    this.expensesSubject.next([...current, newExpense]);
                } else {
                    this.lastCacheKey = ''; // Invalidate cache if adding to different month
                }
            })
        );
    }

    // Explicitly clear cache (e.g. on logout)
    clearCache() {
        this.lastCacheKey = '';
        this.expensesSubject.next([]);
    }
}
