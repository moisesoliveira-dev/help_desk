import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { ThemeShowcaseComponent } from './features/theme-showcase/theme-showcase.component';
import { AuthLayoutComponent } from './features/auth/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { authGuard, noAuthGuard, roleGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canActivate: [noAuthGuard], // Redireciona usuários logados
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
        component: DashboardComponent,
        canActivate: [authGuard] // Requer autenticação
    },
    {
        path: 'theme-showcase',
        component: ThemeShowcaseComponent,
        canActivate: [authGuard] // Requer autenticação
    },
    // Rotas futuras com diferentes níveis de acesso
    {
        path: 'admin',
        canActivate: [adminGuard], // Apenas admins
        children: [
            // Rotas de administração serão adicionadas aqui
        ]
    },
    {
        path: 'tickets',
        canActivate: [authGuard],
        data: { roles: ['admin', 'agent', 'user'] }, // Todos os usuários autenticados
        children: [
            // Rotas de tickets serão adicionadas aqui
        ]
    },
    {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'agent'] }, // Apenas admin e agentes
        children: [
            // Rotas de gestão de usuários serão adicionadas aqui
        ]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
