import { Routes } from '@angular/router';

import { MainLayoutComponent } from './components/layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'metrics', loadComponent: () => import('./pages/metrics/metrics.component').then(m => m.MetricsComponent) },
            { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) }
        ],
        canActivate: [] // Ideally AuthGuard here
    },
    { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) }
];
