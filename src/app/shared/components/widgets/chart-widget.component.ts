import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartData {
    label: string;
    value: number;
    color?: string;
}

@Component({
    selector: 'app-chart-widget',
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <span *ngIf="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </span>
        </div>
      </div>
      <div class="p-6">
        <!-- Bar Chart -->
        <div *ngIf="type === 'bar'" class="space-y-4">
          <div 
            *ngFor="let item of data" 
            class="flex items-center justify-between"
          >
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-12">
              {{ item.label }}
            </span>
            <div class="flex items-center space-x-3 flex-1 ml-4">
              <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  [style.width.%]="getPercentage(item.value)"
                  [style.background-color]="item.color || defaultColor"
                ></div>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white min-w-8 text-right">
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pie Chart (Simple representation) -->
        <div *ngIf="type === 'pie'" class="space-y-3">
          <div 
            *ngFor="let item of data" 
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-3 h-3 rounded-full"
                [style.background-color]="item.color || defaultColor"
              ></div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ item.label }}
              </span>
            </div>
            <div class="text-right">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ item.value }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({{ getPercentage(item.value) }}%)
              </span>
            </div>
          </div>
        </div>

        <!-- Line Chart (Simple representation) -->
        <div *ngIf="type === 'line'" class="space-y-4">
          <div class="flex items-end justify-between h-32 border-b border-gray-200 dark:border-gray-700">
            <div 
              *ngFor="let item of data; let i = index" 
              class="flex flex-col items-center space-y-2"
              [class.flex-1]="true"
            >
              <div class="flex items-end h-24">
                <div 
                  class="w-8 bg-primary-500 rounded-t transition-all duration-500 min-h-1"
                  [style.height.%]="getPercentage(item.value)"
                  [style.background-color]="item.color || defaultColor"
                ></div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 text-center">
                {{ item.label }}
              </span>
            </div>
          </div>
          <div class="flex justify-center space-x-8 text-sm">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ getTotalValue() }}
              </div>
              <div class="text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ getAverageValue().toFixed(1) }}
              </div>
              <div class="text-gray-500 dark:text-gray-400">Média</div>
            </div>
          </div>
        </div>

        <!-- No Data -->
        <div *ngIf="!data || data.length === 0" class="text-center py-8">
          <div class="text-gray-400 dark:text-gray-600 text-4xl mb-2">📊</div>
          <p class="text-gray-500 dark:text-gray-400">Nenhum dado disponível</p>
        </div>
      </div>
    </div>
  `,
    styleUrl: './chart-widget.component.scss'
})
export class ChartWidgetComponent {
    @Input() title!: string;
    @Input() subtitle?: string;
    @Input() type: 'bar' | 'pie' | 'line' = 'bar';
    @Input() data: ChartData[] = [];
    @Input() defaultColor: string = '#3B82F6';

    getPercentage(value: number): number {
        if (!this.data || this.data.length === 0) return 0;
        const max = Math.max(...this.data.map(d => d.value));
        return max > 0 ? (value / max) * 100 : 0;
    }

    getTotalValue(): number {
        return this.data.reduce((sum, item) => sum + item.value, 0);
    }

    getAverageValue(): number {
        if (!this.data || this.data.length === 0) return 0;
        return this.getTotalValue() / this.data.length;
    }
}
