import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [class]="cardClasses">
      <!-- Header -->
      <div *ngIf="hasHeader" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 *ngIf="title" class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p *ngIf="subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ subtitle }}
            </p>
          </div>
          <div *ngIf="hasHeaderAction" class="flex items-center space-x-2">
            <ng-content select="[slot=header-action]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div [class]="contentClasses">
        <ng-content></ng-content>
      </div>

      <!-- Footer -->
      <div *ngIf="hasFooter" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class CardComponent {
    @Input() title?: string;
    @Input() subtitle?: string;
    @Input() variant: CardVariant = 'default';
    @Input() padding = true;
    @Input() hoverable = false;
    @Input() clickable = false;

    public get hasHeader(): boolean {
        return !!(this.title || this.subtitle || this.hasHeaderAction);
    }

    public get hasHeaderAction(): boolean {
        // Verificação será feita via content projection
        return true; // Placeholder - seria melhor usar ContentChildren
    }

    public get hasFooter(): boolean {
        // Verificação será feita via content projection
        return true; // Placeholder - seria melhor usar ContentChildren
    }

    public get cardClasses(): string {
        const baseClasses = [
            'bg-white',
            'dark:bg-gray-800',
            'rounded-lg',
            'transition-all',
            'duration-200'
        ];

        // Variant classes
        const variantClasses = {
            default: ['border', 'border-gray-200', 'dark:border-gray-700'],
            elevated: ['shadow-lg', 'border-0'],
            outlined: ['border-2', 'border-gray-300', 'dark:border-gray-600'],
            filled: ['bg-gray-50', 'dark:bg-gray-900', 'border-0']
        };
        baseClasses.push(...variantClasses[this.variant]);

        // Interactive states
        if (this.hoverable) {
            baseClasses.push('hover:shadow-md');
        }

        if (this.clickable) {
            baseClasses.push(
                'cursor-pointer',
                'hover:shadow-md',
                'active:scale-[0.98]',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-primary-500',
                'focus:ring-offset-2'
            );
        }

        return baseClasses.join(' ');
    }

    public get contentClasses(): string {
        const baseClasses = [];

        if (this.padding) {
            if (this.hasHeader) {
                baseClasses.push('px-6', 'py-4');
            } else {
                baseClasses.push('p-6');
            }
        }

        return baseClasses.join(' ');
    }
}