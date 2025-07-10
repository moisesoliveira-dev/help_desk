import { Injectable, signal, effect } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { User, UserRole, LoginRequest, RegisterRequest, AuthResponse, AuthError } from '../models/auth.models';

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'helpdesk_token';
    private readonly REFRESH_TOKEN_KEY = 'helpdesk_refresh_token';
    private readonly USER_KEY = 'helpdesk_user';
    private readonly REDIRECT_URL_KEY = 'helpdesk_redirect_url';

    // Estado reativo usando signals
    public isAuthenticated = signal<boolean>(false);
    public currentUser = signal<User | null>(null);
    public loading = signal<boolean>(false);
    public error = signal<string | null>(null);

    // BehaviorSubject para compatibilidade com observables
    private authState$ = new BehaviorSubject<AuthState>({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
    });

    constructor() {
        this.initializeAuthState();

        // Effect para sincronizar signals com BehaviorSubject
        effect(() => {
            this.authState$.next({
                isAuthenticated: this.isAuthenticated(),
                user: this.currentUser(),
                token: this.getToken(),
                loading: this.loading(),
                error: this.error()
            });
        });
    }

    /**
     * Inicializa o estado de autenticação a partir do localStorage
     */
    private initializeAuthState(): void {
        const token = this.getToken();
        const user = this.getStoredUser();

        if (token && user && this.isTokenValid(token)) {
            this.isAuthenticated.set(true);
            this.currentUser.set(user);
        } else {
            this.clearAuthData();
        }
    }

    /**
     * Realiza login
     */
    public login(credentials: LoginRequest): Observable<AuthResponse> {
        this.loading.set(true);
        this.error.set(null);

        // Simulação de API - substitua por chamada HTTP real
        return this.simulateLogin(credentials).pipe(
            map((response: AuthResponse) => {
                this.setAuthData(response);
                return response;
            }),
            catchError((error: AuthError) => {
                this.error.set(error.message);
                this.loading.set(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Realiza registro
     */
    public register(userData: RegisterRequest): Observable<AuthResponse> {
        this.loading.set(true);
        this.error.set(null);

        // Simulação de API - substitua por chamada HTTP real
        return this.simulateRegister(userData).pipe(
            map((response: AuthResponse) => {
                this.setAuthData(response);
                return response;
            }),
            catchError((error: AuthError) => {
                this.error.set(error.message);
                this.loading.set(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Realiza logout
     */
    public logout(): void {
        this.clearAuthData();
        this.clearRedirectUrl();
    }

    /**
     * Verifica se o usuário está autenticado
     */
    public isAuthenticatedValue(): boolean {
        return this.isAuthenticated();
    }

    /**
     * Retorna o usuário atual
     */
    public getCurrentUser(): User | null {
        return this.currentUser();
    }

    /**
     * Retorna o token atual
     */
    public getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Retorna o refresh token
     */
    public getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Observable do estado de autenticação
     */
    public getAuthState(): Observable<AuthState> {
        return this.authState$.asObservable();
    }

    /**
     * Define URL de redirecionamento após login
     */
    public setRedirectUrl(url: string): void {
        localStorage.setItem(this.REDIRECT_URL_KEY, url);
    }

    /**
     * Retorna e limpa URL de redirecionamento
     */
    public getAndClearRedirectUrl(): string | null {
        const url = localStorage.getItem(this.REDIRECT_URL_KEY);
        this.clearRedirectUrl();
        return url;
    }

    /**
     * Limpa URL de redirecionamento
     */
    public clearRedirectUrl(): void {
        localStorage.removeItem(this.REDIRECT_URL_KEY);
    }

    /**
     * Atualiza o token
     */
    public refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        // Simulação de refresh - substitua por chamada HTTP real
        return this.simulateRefreshToken(refreshToken);
    }

    /**
     * Verifica se o usuário tem uma role específica
     */
    public hasRole(role: UserRole): boolean {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    /**
     * Verifica se o usuário tem alguma das roles especificadas
     */
    public hasAnyRole(roles: UserRole[]): boolean {
        const user = this.getCurrentUser();
        return user ? roles.includes(user.role) : false;
    }

    // =============== MÉTODOS PRIVADOS ===============

    private setAuthData(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

        this.isAuthenticated.set(true);
        this.currentUser.set(response.user);
        this.loading.set(false);
        this.error.set(null);
    }

    private clearAuthData(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);

        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.loading.set(false);
        this.error.set(null);
    }

    private getStoredUser(): User | null {
        try {
            const userJson = localStorage.getItem(this.USER_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch {
            return null;
        }
    }

    private isTokenValid(token: string): boolean {
        try {
            // Simulação de validação - implementar decodificação JWT real
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch {
            return false;
        }
    }

    // =============== SIMULAÇÕES DE API ===============

    private simulateLogin(credentials: LoginRequest): Observable<AuthResponse> {
        // Credenciais demo
        const validCredentials = [
            {
                email: 'admin@helpdesk.com',
                password: 'admin123',
                user: {
                    id: '1',
                    firstName: 'Admin',
                    lastName: 'Sistema',
                    email: 'admin@helpdesk.com',
                    role: UserRole.ADMIN,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            {
                email: 'agent@helpdesk.com',
                password: 'agent123',
                user: {
                    id: '2',
                    firstName: 'Agente',
                    lastName: 'Suporte',
                    email: 'agent@helpdesk.com',
                    role: UserRole.AGENT,
                    department: 'Suporte Técnico',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            {
                email: 'user@helpdesk.com',
                password: 'user123',
                user: {
                    id: '3',
                    firstName: 'Usuário',
                    lastName: 'Cliente',
                    email: 'user@helpdesk.com',
                    role: UserRole.USER,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ];

        const validUser = validCredentials.find(
            cred => cred.email === credentials.email && cred.password === credentials.password
        );

        return of(null).pipe(
            delay(1000), // Simula latência de rede
            map(() => {
                if (!validUser) {
                    throw {
                        message: 'E-mail ou senha incorretos',
                        code: 'INVALID_CREDENTIALS'
                    } as AuthError;
                }

                // Gera token simulado
                const token = this.generateMockToken(validUser.user);
                const refreshToken = this.generateMockRefreshToken(validUser.user);

                return {
                    user: validUser.user,
                    token,
                    refreshToken,
                    expiresIn: 3600 // 1 hora
                } as AuthResponse;
            })
        );
    }

    private simulateRegister(userData: RegisterRequest): Observable<AuthResponse> {
        return of(null).pipe(
            delay(1000),
            map(() => {
                // Simula verificação de e-mail existente
                if (userData.email.includes('admin') || userData.email.includes('agent')) {
                    throw {
                        message: 'Este e-mail já está sendo usado',
                        code: 'EMAIL_ALREADY_EXISTS'
                    } as AuthError;
                }

                const newUser: User = {
                    id: Date.now().toString(),
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    role: UserRole.USER,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                const token = this.generateMockToken(newUser);
                const refreshToken = this.generateMockRefreshToken(newUser);

                return {
                    user: newUser,
                    token,
                    refreshToken,
                    expiresIn: 3600
                } as AuthResponse;
            })
        );
    }

    private simulateRefreshToken(refreshToken: string): Observable<AuthResponse> {
        return of(null).pipe(
            delay(500),
            map(() => {
                const user = this.getCurrentUser();
                if (!user) {
                    throw new Error('No user found');
                }

                const newToken = this.generateMockToken(user);
                const newRefreshToken = this.generateMockRefreshToken(user);

                return {
                    user,
                    token: newToken,
                    refreshToken: newRefreshToken,
                    expiresIn: 3600
                } as AuthResponse;
            })
        );
    }

    private generateMockToken(user: User): string {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: user.id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 // 1 hora
        }));
        const signature = btoa('mock-signature');

        return `${header}.${payload}.${signature}`;
    }

    private generateMockRefreshToken(user: User): string {
        return btoa(`refresh-${user.id}-${Date.now()}`);
    }
}
