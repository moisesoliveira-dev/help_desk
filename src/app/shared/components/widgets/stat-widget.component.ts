import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stat-widget',
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-md flex items-center justify-center text-lg"
                 [style.background-color]="iconBgColor">
              {{ icon }}
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ label }}
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ value }}
                <span *ngIf="suffix" class="text-lg font-normal text-gray-500 dark:text-gray-400">
                  {{ suffix }}
                </span>
              </dd>
              <dd *ngIf="trend" class="text-sm font-medium mt-1"
                  [class]="getTrendClass()">
                {{ trend }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `,
    styleUrl: './stat-widget.component.scss'
})
export class StatWidgetComponent {
    @Input() label!: string;
    @Input() value!: string | number;
    @Input() suffix?: string;
    @Input() icon!: string;
    @Input() iconBgColor: string = '#3B82F6';
    @Input() trend?: string;
    @Input() trendType?: 'positive' | 'negative' | 'neutral' = 'neutral';

    getTrendClass(): string {
        const baseClasses = 'flex items-center space-x-1';

        switch (this.trendType) {
            case 'positive':
                return `${baseClasses} text-green-600 dark:text-green-400`;
            case 'negative':
                return `${baseClasses} text-red-600 dark:text-red-400`;
            default:
                return `${baseClasses} text-gray-500 dark:text-gray-400`;
        }
    }
}
