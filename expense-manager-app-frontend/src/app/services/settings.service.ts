import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
    defaultRequired: boolean;
    defaultCash: boolean;
    defaultSpent: boolean;
    currencyCode: string;
    pageSize: number;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly STORAGE_KEY = 'expense-manager-settings';

    private defaultSettings: AppSettings = {
        defaultRequired: true,
        defaultCash: true,
        defaultSpent: true,
        currencyCode: 'USD',
        pageSize: 10
    };

    private settingsSubject = new BehaviorSubject<AppSettings>(this.loadSettings());
    settings$ = this.settingsSubject.asObservable();

    constructor() { }

    get settings(): AppSettings {
        return this.settingsSubject.value;
    }

    updateSettings(newSettings: Partial<AppSettings>) {
        const current = this.settings;
        const updated = { ...current, ...newSettings };
        this.settingsSubject.next(updated);
        this.saveSettings(updated);
    }

    private loadSettings(): AppSettings {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return { ...this.defaultSettings, ...JSON.parse(stored) };
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
        return this.defaultSettings;
    }

    private saveSettings(settings: AppSettings) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    }
}
