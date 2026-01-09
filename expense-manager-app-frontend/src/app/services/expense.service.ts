import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
    providedIn: 'root',
})
export class ExpenseService {
    private apiUrl = 'http://localhost:5214/api/Expense';

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
        return this.http.get<Expense[]>(`${this.apiUrl}/${year}/${month}`, {
            headers: this.getHeaders(),
        });
    }

    addExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(this.apiUrl, expense, {
            headers: this.getHeaders(),
        });
    }
}
