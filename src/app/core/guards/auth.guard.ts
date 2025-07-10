import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn, CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rotas que requerem autenticação
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticatedValue()) {
        return true;
    }

    // Salva a URL que o usuário tentou acessar para redirecionamento após login
    authService.setRedirectUrl(state.url);

    // Redireciona para login
    router.navigate(['/auth/login']);
    return false;
};

/**
 * Guard para proteger rotas filhas que requerem autenticação
 */
export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
    return authGuard(childRoute, state);
};

/**
 * Guard para redirecionar usuários já logados das páginas de auth
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticatedValue()) {
        return true;
    }

    // Se já está logado, redireciona para dashboard
    router.navigate(['/dashboard']);
    return false;
};

/**
 * Guard baseado em roles/permissões
 */
export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticatedValue()) {
        authService.setRedirectUrl(state.url);
        router.navigate(['/auth/login']);
        return false;
    }

    const requiredRoles = route.data?.['roles'] as string[];
    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }

    const userRole = authService.getCurrentUser()?.role;
    if (userRole && requiredRoles.includes(userRole)) {
        return true;
    }

    // Usuário não tem permissão
    router.navigate(['/dashboard'], {
        queryParams: { error: 'insufficient-permissions' }
    });
    return false;
};

/**
 * Guard para verificar se o usuário é admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticatedValue()) {
        authService.setRedirectUrl(state.url);
        router.navigate(['/auth/login']);
        return false;
    }

    const user = authService.getCurrentUser();
    if (user?.role === 'admin') {
        return true;
    }

    // Não é admin
    router.navigate(['/dashboard'], {
        queryParams: { error: 'admin-required' }
    });
    return false;
};
