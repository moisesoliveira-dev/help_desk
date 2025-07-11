import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

export interface SearchFilter {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'boolean' | 'range';
    options?: Array<{ value: any; label: string }>;
    value?: any;
    placeholder?: string;
}

export interface SearchResult {
    id: string;
    type: 'ticket' | 'user' | 'article';
    title: string;
    subtitle?: string;
    description?: string;
    url?: string;
    metadata?: Record<string, any>;
}

export interface SearchState {
    query: string;
    filters: SearchFilter[];
    results: SearchResult[];
    loading: boolean;
    totalResults: number;
    currentPage: number;
    pageSize: number;
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly SEARCH_HISTORY_KEY = 'helpdesk_search_history';
    private readonly FILTERS_KEY = 'helpdesk_search_filters';

    // Estado reativo usando signals
    public searchQuery = signal<string>('');
    public activeFilters = signal<SearchFilter[]>([]);
    public searchResults = signal<SearchResult[]>([]);
    public isLoading = signal<boolean>(false);
    public totalResults = signal<number>(0);
    public currentPage = signal<number>(1);
    public pageSize = signal<number>(10);

    // Computed signals
    public hasActiveFilters = computed(() =>
        this.activeFilters().some(filter => filter.value !== undefined && filter.value !== null && filter.value !== '')
    );

    public hasResults = computed(() => this.searchResults().length > 0);
    public totalPages = computed(() => Math.ceil(this.totalResults() / this.pageSize()));

    // BehaviorSubject para stream de pesquisa
    private searchSubject = new BehaviorSubject<string>('');
    public searchStream$ = this.searchSubject.asObservable().pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.performSearch(query))
    );

    // Filtros disponíveis para o sistema
    private availableFilters: SearchFilter[] = [
        {
            key: 'type',
            label: 'Tipo',
            type: 'select',
            options: [
                { value: 'ticket', label: 'Tickets' },
                { value: 'user', label: 'Usuários' },
                { value: 'article', label: 'Artigos' }
            ],
            placeholder: 'Selecione o tipo'
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'open', label: 'Aberto' },
                { value: 'in-progress', label: 'Em Andamento' },
                { value: 'pending', label: 'Pendente' },
                { value: 'closed', label: 'Fechado' }
            ],
            placeholder: 'Selecione o status'
        },
        {
            key: 'priority',
            label: 'Prioridade',
            type: 'select',
            options: [
                { value: 'high', label: 'Alta' },
                { value: 'medium', label: 'Média' },
                { value: 'low', label: 'Baixa' }
            ],
            placeholder: 'Selecione a prioridade'
        },
        {
            key: 'dateRange',
            label: 'Período',
            type: 'select',
            options: [
                { value: 'today', label: 'Hoje' },
                { value: 'week', label: 'Esta semana' },
                { value: 'month', label: 'Este mês' },
                { value: 'quarter', label: 'Este trimestre' },
                { value: 'year', label: 'Este ano' }
            ],
            placeholder: 'Selecione o período'
        },
        {
            key: 'assignee',
            label: 'Responsável',
            type: 'text',
            placeholder: 'Nome do responsável'
        },
        {
            key: 'department',
            label: 'Departamento',
            type: 'select',
            options: [
                { value: 'ti', label: 'TI' },
                { value: 'rh', label: 'RH' },
                { value: 'vendas', label: 'Vendas' },
                { value: 'suporte', label: 'Suporte' }
            ],
            placeholder: 'Selecione o departamento'
        }
    ];

    constructor() {
        this.loadSavedFilters();
        this.setupSearchStream();
    }

    /**
     * Inicia uma pesquisa
     */
    public search(query: string): void {
        this.searchQuery.set(query);
        this.searchSubject.next(query);
        this.addToSearchHistory(query);
    }

    /**
     * Adiciona ou atualiza um filtro
     */
    public setFilter(key: string, value: any): void {
        const currentFilters = [...this.activeFilters()];
        const existingFilterIndex = currentFilters.findIndex(f => f.key === key);

        if (existingFilterIndex >= 0) {
            currentFilters[existingFilterIndex].value = value;
        } else {
            const filterTemplate = this.availableFilters.find(f => f.key === key);
            if (filterTemplate) {
                currentFilters.push({ ...filterTemplate, value });
            }
        }

        this.activeFilters.set(currentFilters);
        this.saveFilters();
        this.triggerSearch();
    }

    /**
     * Remove um filtro
     */
    public removeFilter(key: string): void {
        const currentFilters = this.activeFilters().filter(f => f.key !== key);
        this.activeFilters.set(currentFilters);
        this.saveFilters();
        this.triggerSearch();
    }

    /**
     * Limpa todos os filtros
     */
    public clearFilters(): void {
        this.activeFilters.set([]);
        this.saveFilters();
        this.triggerSearch();
    }

    /**
     * Retorna os filtros disponíveis
     */
    public getAvailableFilters(): SearchFilter[] {
        return this.availableFilters;
    }

    /**
     * Altera a página atual
     */
    public setPage(page: number): void {
        this.currentPage.set(page);
        this.triggerSearch();
    }

    /**
     * Altera o tamanho da página
     */
    public setPageSize(size: number): void {
        this.pageSize.set(size);
        this.currentPage.set(1);
        this.triggerSearch();
    }

    /**
     * Retorna o histórico de pesquisas
     */
    public getSearchHistory(): string[] {
        const history = localStorage.getItem(this.SEARCH_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    }

    /**
     * Limpa o histórico de pesquisas
     */
    public clearSearchHistory(): void {
        localStorage.removeItem(this.SEARCH_HISTORY_KEY);
    }

    /**
     * Executa a pesquisa com os filtros atuais
     */
    private triggerSearch(): void {
        const query = this.searchQuery();
        if (query || this.hasActiveFilters()) {
            this.searchSubject.next(query);
        }
    }

    /**
     * Configura o stream de pesquisa
     */
    private setupSearchStream(): void {
        this.searchStream$.subscribe(results => {
            this.searchResults.set(results);
            this.isLoading.set(false);
        });
    }

    /**
     * Executa a pesquisa (simulação - substituir por API real)
     */
    private performSearch(query: string): Observable<SearchResult[]> {
        this.isLoading.set(true);

        // Simulação de dados - substituir por chamada à API
        const mockResults: SearchResult[] = [
            {
                id: 'ticket-001',
                type: 'ticket',
                title: 'Problema com login no sistema',
                subtitle: '#TK-001 • Maria Silva',
                description: 'Usuário não consegue fazer login na aplicação principal...',
                url: '/tickets/001',
                metadata: { status: 'open', priority: 'high', department: 'ti' }
            },
            {
                id: 'ticket-002',
                type: 'ticket',
                title: 'Erro ao gerar relatório mensal',
                subtitle: '#TK-002 • João Santos',
                description: 'Sistema apresenta erro 500 ao tentar gerar relatório...',
                url: '/tickets/002',
                metadata: { status: 'in-progress', priority: 'medium', department: 'ti' }
            },
            {
                id: 'user-001',
                type: 'user',
                title: 'Ana Costa',
                subtitle: 'ana.costa@empresa.com • Vendas',
                description: 'Gerente de Vendas - Ativa desde 2023',
                url: '/users/001',
                metadata: { department: 'vendas', active: true }
            },
            {
                id: 'article-001',
                type: 'article',
                title: 'Como resetar sua senha',
                subtitle: 'Base de Conhecimento • Atualizado em 10/01/2025',
                description: 'Guia passo-a-passo para resetar senhas do sistema...',
                url: '/knowledge-base/001',
                metadata: { category: 'tutorial', views: 1250 }
            }
        ];

        // Filtrar resultados baseado na query e filtros
        let filteredResults = mockResults;

        if (query) {
            const searchTerm = query.toLowerCase();
            filteredResults = filteredResults.filter(result =>
                result.title.toLowerCase().includes(searchTerm) ||
                result.description?.toLowerCase().includes(searchTerm) ||
                result.subtitle?.toLowerCase().includes(searchTerm)
            );
        }

        // Aplicar filtros ativos
        const filters = this.activeFilters();
        filteredResults = filteredResults.filter(result => {
            return filters.every(filter => {
                if (!filter.value) return true;

                switch (filter.key) {
                    case 'type':
                        return result.type === filter.value;
                    case 'status':
                        return result.metadata?.['status'] === filter.value;
                    case 'priority':
                        return result.metadata?.['priority'] === filter.value;
                    case 'department':
                        return result.metadata?.['department'] === filter.value;
                    default:
                        return true;
                }
            });
        });

        this.totalResults.set(filteredResults.length);

        // Paginação
        const startIndex = (this.currentPage() - 1) * this.pageSize();
        const endIndex = startIndex + this.pageSize();
        const paginatedResults = filteredResults.slice(startIndex, endIndex);

        // Simular delay de rede
        return of(paginatedResults).pipe(debounceTime(500));
    }

    /**
     * Adiciona query ao histórico de pesquisas
     */
    private addToSearchHistory(query: string): void {
        if (!query.trim()) return;

        const history = this.getSearchHistory();
        const updatedHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
        localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    }

    /**
     * Salva filtros no localStorage
     */
    private saveFilters(): void {
        const filtersToSave = this.activeFilters().map(f => ({
            key: f.key,
            value: f.value
        }));
        localStorage.setItem(this.FILTERS_KEY, JSON.stringify(filtersToSave));
    }

    /**
     * Carrega filtros salvos
     */
    private loadSavedFilters(): void {
        const savedFilters = localStorage.getItem(this.FILTERS_KEY);
        if (savedFilters) {
            try {
                const filters = JSON.parse(savedFilters);
                const activeFilters: SearchFilter[] = [];

                filters.forEach((saved: any) => {
                    const filterTemplate = this.availableFilters.find(f => f.key === saved.key);
                    if (filterTemplate && saved.value) {
                        activeFilters.push({ ...filterTemplate, value: saved.value });
                    }
                });

                this.activeFilters.set(activeFilters);
            } catch (error) {
                console.warn('Error loading saved filters:', error);
            }
        }
    }
}
