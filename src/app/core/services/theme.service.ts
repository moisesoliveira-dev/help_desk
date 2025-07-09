import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'helpdesk-theme';

    // Signal para reatividade
    public currentTheme = signal<Theme>('system');
    public isDarkMode = signal<boolean>(false);

    constructor() {
        this.initializeTheme();

        // Effect para aplicar mudanças de tema
        effect(() => {
            this.applyTheme(this.currentTheme());
        });
    }

    private initializeTheme(): void {
        const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
        const initialTheme = savedTheme || 'system';
        this.currentTheme.set(initialTheme);
    }

    public setTheme(theme: Theme): void {
        this.currentTheme.set(theme);
        localStorage.setItem(this.THEME_KEY, theme);
    }

    public toggleTheme(): void {
        const current = this.currentTheme();
        if (current === 'light') {
            this.setTheme('dark');
        } else if (current === 'dark') {
            this.setTheme('system');
        } else {
            this.setTheme('light');
        }
    }

    private applyTheme(theme: Theme): void {
        const root = document.documentElement;

        // Remove classes existentes
        root.classList.remove('light', 'dark');

        let isDark = false;

        switch (theme) {
            case 'light':
                root.classList.add('light');
                isDark = false;
                break;
            case 'dark':
                root.classList.add('dark');
                isDark = true;
                break;
            case 'system':
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.add(isDark ? 'dark' : 'light');
                break;
        }

        this.isDarkMode.set(isDark);

        // Atualiza meta theme-color
        this.updateMetaThemeColor(isDark);
    }

    private updateMetaThemeColor(isDark: boolean): void {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const color = isDark ? '#1f2937' : '#ffffff';

        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = color;
            document.head.appendChild(meta);
        }
    }

    // Listener para mudanças no sistema
    public listenToSystemThemeChanges(): void {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme() === 'system') {
                this.applyTheme('system');
            }
        });
    }

    // Utilitários para components
    public getThemeIcon(): string {
        const theme = this.currentTheme();
        switch (theme) {
            case 'light': return '☀️';
            case 'dark': return '🌙';
            case 'system': return '💻';
            default: return '💻';
        }
    }

    public getThemeLabel(): string {
        const theme = this.currentTheme();
        switch (theme) {
            case 'light': return 'Tema Claro';
            case 'dark': return 'Tema Escuro';
            case 'system': return 'Sistema';
            default: return 'Sistema';
        }
    }
}