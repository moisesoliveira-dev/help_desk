import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor para adicionar token de autenticação nas requisições HTTP
 * e tratar erros de autenticação/autorização
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // URLs que não precisam de autenticação
    const publicUrls = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/public'
    ];

    // Verifica se a URL é pública
    const isPublicUrl = publicUrls.some(url => req.url.includes(url));

    if (isPublicUrl) {
        return next(req);
    }

    // Adiciona token se disponível
    const token = authService.getToken();
    let authReq = req;

    if (token) {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token expirado ou inválido
                return handleUnauthorizedError(error, authService, router);
            }

            if (error.status === 403) {
                // Sem permissão
                handleForbiddenError(router);
            }

            return throwError(() => error);
        })
    );
};

/**
 * Trata erros 401 (Unauthorized)
 */
function handleUnauthorizedError(
    error: HttpErrorResponse,
    authService: AuthService,
    router: Router
) {
    // Se tem refresh token, tenta renovar
    const refreshToken = authService.getRefreshToken();

    if (refreshToken && authService.isAuthenticatedValue()) {
        return authService.refreshToken().pipe(
            switchMap(() => {
                // Token renovado com sucesso, retry da requisição original
                const token = authService.getToken();
                const retryReq = error.url ?
                    new HttpRequest('GET', error.url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }) : null;

                // Nota: Em um cenário real, você manteria a requisição original
                // Esta é uma simplificação para demonstração
                return throwError(() => new Error('Request should be retried'));
            }),
            catchError(() => {
                // Falha ao renovar token
                authService.logout();
                router.navigate(['/auth/login']);
                return throwError(() => error);
            })
        );
    } else {
        // Sem refresh token ou não autenticado
        authService.logout();
        router.navigate(['/auth/login']);
        return throwError(() => error);
    }
}

/**
 * Trata erros 403 (Forbidden)
 */
function handleForbiddenError(router: Router) {
    router.navigate(['/dashboard'], {
        queryParams: { error: 'insufficient-permissions' }
    });
}

/**
 * Interceptor para adicionar headers comuns
 */
export const headerInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const modifiedReq = req.clone({
        headers: req.headers
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('X-Requested-With', 'XMLHttpRequest')
    });

    return next(modifiedReq);
};

/**
 * Interceptor para logging de requisições (apenas em desenvolvimento)
 */
export const loggingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const isDevelopment = !environment.production;

    if (isDevelopment) {
        console.group(`🌐 HTTP ${req.method} ${req.url}`);
        console.log('Request:', req);
        console.groupEnd();
    }

    const startTime = Date.now();

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (isDevelopment) {
                const duration = Date.now() - startTime;
                console.group(`❌ HTTP ${req.method} ${req.url} - ${error.status} (${duration}ms)`);
                console.error('Error:', error);
                console.groupEnd();
            }
            return throwError(() => error);
        }),
        // Sucesso também pode ser logado se necessário
    );
};

// Placeholder para environment - será substituído pela importação real
const environment = { production: false };
