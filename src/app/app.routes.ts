import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { ThemeShowcaseComponent } from './features/theme-showcase/theme-showcase.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'theme-showcase',
        component: ThemeShowcaseComponent
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
