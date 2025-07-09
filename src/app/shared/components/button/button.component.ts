import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick()"
      [attr.aria-disabled]="disabled || loading"
    >
      <!-- Loading Spinner -->
      <svg
        *ngIf="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>

      <!-- Icon Left -->
      <span *ngIf="iconLeft && !loading" [innerHTML]="iconLeft" class="mr-2"></span>

      <!-- Content -->
      <ng-content></ng-content>

      <!-- Icon Right -->
      <span *ngIf="iconRight && !loading" [innerHTML]="iconRight" class="ml-2"></span>
    </button>
  `,
    styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() size: ButtonSize = 'md';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() fullWidth = false;
    @Input() iconLeft?: string;
    @Input() iconRight?: string;

    @Output() clicked = new EventEmitter<Event>();

    public get buttonClasses(): string {
        const baseClasses = [
            'inline-flex',
            'items-center',
            'justify-center',
            'font-medium',
            'rounded-lg',
            'border',
            'transition-all',
            'duration-200',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-offset-2',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
            'disabled:pointer-events-none'
        ];

        // Full width
        if (this.fullWidth) {
            baseClasses.push('w-full');
        }

        // Size classes
        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base'
        };
        baseClasses.push(sizeClasses[this.size]);

        // Variant classes
        const variantClasses = {
            primary: [
                'bg-primary-600',
                'hover:bg-primary-700',
                'active:bg-primary-800',
                'text-white',
                'border-primary-600',
                'focus:ring-primary-500',
                'shadow-sm'
            ],
            secondary: [
                'bg-gray-600',
                'hover:bg-gray-700',
                'active:bg-gray-800',
                'text-white',
                'border-gray-600',
                'focus:ring-gray-500',
                'shadow-sm'
            ],
            outline: [
                'bg-transparent',
                'hover:bg-primary-50',
                'active:bg-primary-100',
                'text-primary-600',
                'border-primary-600',
                'focus:ring-primary-500',
                'dark:hover:bg-primary-950',
                'dark:active:bg-primary-900',
                'dark:text-primary-400',
                'dark:border-primary-400'
            ],
            ghost: [
                'bg-transparent',
                'hover:bg-gray-100',
                'active:bg-gray-200',
                'text-gray-700',
                'border-transparent',
                'focus:ring-gray-500',
                'dark:hover:bg-gray-800',
                'dark:active:bg-gray-700',
                'dark:text-gray-300'
            ],
            danger: [
                'bg-error-600',
                'hover:bg-error-700',
                'active:bg-error-800',
                'text-white',
                'border-error-600',
                'focus:ring-error-500',
                'shadow-sm'
            ]
        };

        baseClasses.push(...variantClasses[this.variant]);

        return baseClasses.join(' ');
    }

    public onClick(): void {
        if (!this.disabled && !this.loading) {
            this.clicked.emit();
        }
    }
}