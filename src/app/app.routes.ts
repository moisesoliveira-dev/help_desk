import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { ThemeShowcaseComponent } from './features/theme-showcase/theme-showcase.component';
import { AuthLayoutComponent } from './features/auth/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            }
        ]
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
