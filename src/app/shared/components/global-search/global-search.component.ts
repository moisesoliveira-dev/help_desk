import { Component, OnInit, OnDestroy, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SearchService, SearchResult } from '../../../core/services/search.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-global-search',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="relative flex-1 max-w-lg mx-8" #searchContainer>
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-400 dark:text-gray-500" [class.animate-spin]="isLoading()">
            {{ isLoading() ? '⟳' : '🔍' }}
          </span>
        </div>
        <input
          #searchInput
          type="text"
          class="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
          [placeholder]="searchPlaceholder"
          [(ngModel)]="searchQuery"
          (input)="onSearchInput()"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown.escape)="closeResults()"
          (keydown.enter)="selectCurrentResult()"
        />
        
        <!-- Clear button -->
        <button
          *ngIf="searchQuery"
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 dark:hover:text-gray-300"
          (click)="clearSearch()"
        >
          ✕
        </button>
      </div>

      <!-- Search Results Dropdown -->
      <div
        *ngIf="showResults && (hasResults() || showHistory)"
        class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden"
      >
        <!-- Loading State -->
        <div *ngIf="isLoading()" class="p-4 text-center">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>

        <!-- Search Results -->
        <div *ngIf="!isLoading() && hasResults()" class="max-h-80 overflow-y-auto">
          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ totalResults() }} resultado(s) encontrado(s)
            </span>
          </div>
          
          <div *ngFor="let result of searchResults(); let i = index" 
               class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-150"
               [class.bg-primary-50]="selectedIndex === i"
               (click)="selectResult(result)">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 mt-1">
                <span class="text-lg">{{ getResultIcon(result.type) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ result.title }}
                </p>
                <p *ngIf="result.subtitle" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ result.subtitle }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      [class]="getTypeClass(result.type)">
                  {{ getTypeLabel(result.type) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="!isLoading() && !hasResults() && searchQuery && !showHistory" class="p-4 text-center">
          <div class="text-gray-400 dark:text-gray-600 text-2xl mb-2">🔍</div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Nenhum resultado encontrado para "{{ searchQuery }}"
          </p>
        </div>

        <!-- Search History -->
        <div *ngIf="!isLoading() && !hasResults() && showHistory && searchHistory.length > 0" class="max-h-40 overflow-y-auto">
          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pesquisas recentes
              </span>
              <button
                type="button"
                class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                (click)="clearHistory()"
              >
                Limpar
              </button>
            </div>
          </div>
          
          <div *ngFor="let historyItem of searchHistory" 
               class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
               (click)="selectHistoryItem(historyItem)">
            <div class="flex items-center space-x-3">
              <span class="text-gray-400 dark:text-gray-500">🕐</span>
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ historyItem }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('searchContainer') searchContainer!: ElementRef;

    searchQuery = '';
    showResults = false;
    showHistory = false;
    selectedIndex = -1;
    searchHistory: string[] = [];

    private searchSubscription?: Subscription;
    private clickOutsideListener?: (event: Event) => void;

    // Reactive properties from SearchService
    searchResults = computed(() => this.searchService.searchResults());
    isLoading = computed(() => this.searchService.isLoading());
    hasResults = computed(() => this.searchService.hasResults());
    totalResults = computed(() => this.searchService.totalResults());

    searchPlaceholder = 'Buscar tickets, usuários, artigos...';

    constructor(private searchService: SearchService) { }

    ngOnInit(): void {
        this.loadSearchHistory();
        this.setupClickOutsideListener();

        // Subscribe to search stream
        this.searchSubscription = this.searchService.searchStream$.subscribe();
    }

    ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
        this.removeClickOutsideListener();
    }

    onSearchInput(): void {
        this.selectedIndex = -1;
        this.showHistory = !this.searchQuery;
        this.showResults = true;

        if (this.searchQuery.trim()) {
            this.searchService.search(this.searchQuery);
        }
    }

    onFocus(): void {
        this.showHistory = !this.searchQuery;
        this.showResults = true;
        this.loadSearchHistory();
    }

    onBlur(): void {
        // Delay to allow click events on results
        setTimeout(() => {
            this.closeResults();
        }, 200);
    }

    closeResults(): void {
        this.showResults = false;
        this.showHistory = false;
        this.selectedIndex = -1;
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.searchService.search('');
        this.closeResults();
        this.searchInputRef.nativeElement.focus();
    }

    navigateResults(direction: number): void {
        if (!this.showResults) return;

        const maxIndex = this.searchResults().length - 1;

        if (direction === 1) {
            this.selectedIndex = this.selectedIndex < maxIndex ? this.selectedIndex + 1 : 0;
        } else {
            this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : maxIndex;
        }
    }

    selectCurrentResult(): void {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.searchResults().length) {
            this.selectResult(this.searchResults()[this.selectedIndex]);
        }
    }

    selectResult(result: SearchResult): void {
        if (result.url) {
            // TODO: Navigate to result URL
            console.log('Navigate to:', result.url);
        }
        this.closeResults();
    }

    selectHistoryItem(item: string): void {
        this.searchQuery = item;
        this.searchService.search(item);
        this.showHistory = false;
    }

    clearHistory(): void {
        this.searchService.clearSearchHistory();
        this.loadSearchHistory();
    }

    viewAllResults(): void {
        // TODO: Navigate to search results page
        console.log('View all results for:', this.searchQuery);
        this.closeResults();
    }

    getResultIcon(type: string): string {
        const icons = {
            ticket: '🎫',
            user: '👤',
            article: '📄'
        };
        return icons[type as keyof typeof icons] || '📄';
    }

    getTypeClass(type: string): string {
        const classes = {
            ticket: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            user: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            article: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        };
        return classes[type as keyof typeof classes] || classes.article;
    }

    getTypeLabel(type: string): string {
        const labels = {
            ticket: 'Ticket',
            user: 'Usuário',
            article: 'Artigo'
        };
        return labels[type as keyof typeof labels] || 'Item';
    }

    private loadSearchHistory(): void {
        this.searchHistory = this.searchService.getSearchHistory();
    }

    private setupClickOutsideListener(): void {
        this.clickOutsideListener = (event: Event) => {
            if (!this.searchContainer.nativeElement.contains(event.target as Node)) {
                this.closeResults();
            }
        };
        document.addEventListener('click', this.clickOutsideListener);
    }

    private removeClickOutsideListener(): void {
        if (this.clickOutsideListener) {
            document.removeEventListener('click', this.clickOutsideListener);
        }
    }
}
