import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DateService {
    private currentDateSubject = new BehaviorSubject<Date>(new Date());
    currentDate$ = this.currentDateSubject.asObservable();

    constructor() { }

    get currentDateValue(): Date {
        return this.currentDateSubject.value;
    }

    setCurrentDate(date: Date) {
        this.currentDateSubject.next(date);
    }

    changeMonth(delta: number) {
        const newDate = new Date(this.currentDateValue.setMonth(this.currentDateValue.getMonth() + delta));
        this.setCurrentDate(newDate);
    }
}
