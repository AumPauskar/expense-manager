import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private theme = signal<Theme>('system');
    readonly currentTheme = this.theme.asReadonly();

    constructor() {
        // Load from local storage
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            this.theme.set(savedTheme);
        }

        // Effect to apply theme whenever it changes
        effect(() => {
            const theme = this.theme();
            localStorage.setItem('theme', theme);
            this.applyTheme(theme);
        });

        // Listen for system changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.theme() === 'system') {
                this.applyTheme('system');
            }
        });
    }

    setTheme(theme: Theme) {
        this.theme.set(theme);
    }

    private applyTheme(theme: Theme) {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(systemDark ? 'dark' : 'light');
        } else {
            root.classList.add(theme);
        }
    }
}
