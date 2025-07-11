import { Component, OnInit, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchFilter } from '../../../core/services/search.service';

@Component({
    selector: 'app-advanced-filters',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Filtros Avançados
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ activeFiltersCount() }} filtro(s) ativo(s)
            </span>
            <button
              *ngIf="hasActiveFilters()"
              type="button"
              class="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
              (click)="clearAllFilters()"
            >
              Limpar tudo
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Grid -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Dynamic Filters -->
          <div *ngFor="let filter of availableFilters" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ filter.label }}
            </label>

            <!-- Text Input -->
            <input
              *ngIf="filter.type === 'text'"
              type="text"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              [placeholder]="filter.placeholder"
              [value]="getFilterValue(filter.key)"
              (input)="updateFilter(filter.key, $event)"
            />

            <!-- Select Input -->
            <select
              *ngIf="filter.type === 'select'"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              [value]="getFilterValue(filter.key)"
              (change)="updateFilter(filter.key, $event)"
            >
              <option value="">{{ filter.placeholder || 'Selecione...' }}</option>
              <option
                *ngFor="let option of filter.options"
                [value]="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <!-- Date Input -->
            <input
              *ngIf="filter.type === 'date'"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              [value]="getFilterValue(filter.key)"
              (change)="updateFilter(filter.key, $event)"
            />

            <!-- Boolean/Checkbox Input -->
            <div *ngIf="filter.type === 'boolean'" class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                [checked]="getFilterValue(filter.key)"
                (change)="updateFilter(filter.key, $event)"
              />
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {{ filter.placeholder || filter.label }}
              </label>
            </div>

            <!-- Range Input -->
            <div *ngIf="filter.type === 'range'" class="space-y-2">
              <div class="flex space-x-2">
                <input
                  type="number"
                  placeholder="Mín"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  [value]="getRangeValue(filter.key, 'min')"
                  (input)="updateRangeFilter(filter.key, 'min', $event)"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  [value]="getRangeValue(filter.key, 'max')"
                  (input)="updateRangeFilter(filter.key, 'max', $event)"
                />
              </div>
            </div>

            <!-- Clear individual filter -->
            <button
              *ngIf="hasFilterValue(filter.key)"
              type="button"
              class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              (click)="clearFilter(filter.key)"
            >
              Limpar filtro
            </button>
          </div>
        </div>

        <!-- Active Filters Summary -->
        <div *ngIf="hasActiveFilters()" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Filtros Ativos:
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let filter of activeFilters()"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400"
            >
              {{ filter.label }}: {{ getDisplayValue(filter) }}
              <button
                type="button"
                class="ml-2 inline-flex items-center justify-center w-4 h-4 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                (click)="clearFilter(filter.key)"
              >
                ✕
              </button>
            </span>
          </div>
        </div>

        <!-- Quick Filter Presets -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Filtros Rápidos:
          </h4>
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let preset of quickFilters"
              type="button"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              (click)="applyQuickFilter(preset)"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styleUrl: './advanced-filters.component.scss'
})
export class AdvancedFiltersComponent implements OnInit {
    @Input() visible = false;
    @Output() filtersChange = new EventEmitter<SearchFilter[]>();

    availableFilters: SearchFilter[] = [];

    // Quick filter presets
    quickFilters = [
        {
            label: 'Meus Tickets Abertos',
            filters: [
                { key: 'status', value: 'open' },
                { key: 'assignee', value: 'current_user' }
            ]
        },
        {
            label: 'Alta Prioridade',
            filters: [
                { key: 'priority', value: 'high' }
            ]
        },
        {
            label: 'Esta Semana',
            filters: [
                { key: 'dateRange', value: 'week' }
            ]
        },
        {
            label: 'Pendentes de Resposta',
            filters: [
                { key: 'status', value: 'pending' }
            ]
        }
    ];

    // Reactive properties
    activeFilters = computed(() => this.searchService.activeFilters());
    hasActiveFilters = computed(() => this.searchService.hasActiveFilters());
    activeFiltersCount = computed(() => this.activeFilters().length);

    constructor(private searchService: SearchService) { }

    ngOnInit(): void {
        this.availableFilters = this.searchService.getAvailableFilters();
    }

    updateFilter(key: string, event: Event): void {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

        if (value === '' || value === null || value === undefined) {
            this.searchService.removeFilter(key);
        } else {
            this.searchService.setFilter(key, value);
        }
    }

    updateRangeFilter(key: string, type: 'min' | 'max', event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        const currentValue = this.getFilterValue(key) || {};
        const newValue = { ...currentValue, [type]: value };

        // Remove empty values
        if (!newValue.min && !newValue.max) {
            this.searchService.removeFilter(key);
        } else {
            this.searchService.setFilter(key, newValue);
        }
    }

    clearFilter(key: string): void {
        this.searchService.removeFilter(key);
    }

    clearAllFilters(): void {
        this.searchService.clearFilters();
    }

    applyQuickFilter(preset: any): void {
        // Clear existing filters first
        this.clearAllFilters();

        // Apply preset filters
        preset.filters.forEach((filter: any) => {
            this.searchService.setFilter(filter.key, filter.value);
        });
    }

    getFilterValue(key: string): any {
        const filter = this.activeFilters().find(f => f.key === key);
        return filter?.value;
    }

    getRangeValue(key: string, type: 'min' | 'max'): any {
        const value = this.getFilterValue(key);
        return value?.[type] || '';
    }

    hasFilterValue(key: string): boolean {
        const value = this.getFilterValue(key);
        return value !== undefined && value !== null && value !== '';
    }

    getDisplayValue(filter: SearchFilter): string {
        if (filter.type === 'select' && filter.options) {
            const option = filter.options.find(opt => opt.value === filter.value);
            return option?.label || filter.value;
        }

        if (filter.type === 'boolean') {
            return filter.value ? 'Sim' : 'Não';
        }

        if (filter.type === 'range') {
            const range = filter.value;
            if (range?.min && range?.max) {
                return `${range.min} - ${range.max}`;
            } else if (range?.min) {
                return `≥ ${range.min}`;
            } else if (range?.max) {
                return `≤ ${range.max}`;
            }
        }

        return filter.value?.toString() || '';
    }
}
