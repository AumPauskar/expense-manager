import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

export interface User {
    id: number;
    username: string;
}

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/Account';
    private userSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    register(username: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register?username=${username}&password=${password}`, {});
    }

    login(username: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login?username=${username}&password=${password}`, {}).pipe(
            tap((user) => {
                this.setUser(user);
            })
        );
    }

    logout() {
        localStorage.removeItem('expense_app_user');
        this.userSubject.next(null);
    }

    get currentUserValue(): User | null {
        return this.userSubject.value;
    }

    private setUser(user: User) {
        localStorage.setItem('expense_app_user', JSON.stringify(user));
        this.userSubject.next(user);
    }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('expense_app_user');
        return userStr ? JSON.parse(userStr) : null;
    }
}
