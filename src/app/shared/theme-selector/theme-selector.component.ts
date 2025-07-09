import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../core/services/theme.service';

@Component({
    selector: 'app-theme-selector',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative">
      <!-- Theme Toggle Button -->
      <button
        type="button"
        class="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isDropdownOpen"
        aria-haspopup="true"
      >
        <span class="text-lg">{{ themeService.getThemeIcon() }}</span>
        <span class="hidden sm:inline text-sm font-medium">{{ themeService.getThemeLabel() }}</span>
        <svg class="w-4 h-4 transition-transform" [class.rotate-180]="isDropdownOpen" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        *ngIf="isDropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1" role="none">
          <button
            *ngFor="let option of themeOptions"
            type="button"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            [class.bg-gray-100]="!themeService.isDarkMode() && themeService.currentTheme() === option.value"
            [class.dark:bg-gray-700]="themeService.isDarkMode() && themeService.currentTheme() === option.value"
            (click)="selectTheme(option.value)"
            role="menuitem"
          >
            <span class="mr-3 text-lg">{{ option.icon }}</span>
            <span class="flex-1">{{ option.label }}</span>
            <svg
              *ngIf="themeService.currentTheme() === option.value"
              class="w-4 h-4 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop for mobile -->
    <div
      *ngIf="isDropdownOpen"
      class="fixed inset-0 z-40 sm:hidden"
      (click)="closeDropdown()"
    ></div>
  `,
    styles: [`
    :host {
      display: block;
    }
    
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class ThemeSelectorComponent {
    public themeService = inject(ThemeService);
    public isDropdownOpen = false;

    public themeOptions = [
        { value: 'light' as Theme, label: 'Tema Claro', icon: '☀️' },
        { value: 'dark' as Theme, label: 'Tema Escuro', icon: '🌙' },
        { value: 'system' as Theme, label: 'Sistema', icon: '💻' }
    ];

    constructor() {
        // Inicia o listener para mudanças do sistema
        this.themeService.listenToSystemThemeChanges();
    }

    public toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    public closeDropdown(): void {
        this.isDropdownOpen = false;
    }

    public selectTheme(theme: Theme): void {
        this.themeService.setTheme(theme);
        this.closeDropdown();
    }
}