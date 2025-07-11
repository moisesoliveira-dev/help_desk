import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import {
    Ticket,
    TicketListRequest,
    TicketListResponse,
    CreateTicketRequest,
    UpdateTicketRequest,
    BulkTicketAction,
    TicketStatus,
    TicketPriority,
    TicketCategory,
    User,
    UserRole
} from '../models/ticket.models';

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    // Estado reativo usando signals
    public tickets = signal<Ticket[]>([]);
    public loading = signal<boolean>(false);
    public error = signal<string | null>(null);
    public totalTickets = signal<number>(0);
    public currentPage = signal<number>(1);
    public pageSize = signal<number>(10);
    public selectedTickets = signal<string[]>([]);

    // Computed signals
    public totalPages = computed(() => Math.ceil(this.totalTickets() / this.pageSize()));
    public hasNext = computed(() => this.currentPage() < this.totalPages());
    public hasPrevious = computed(() => this.currentPage() > 1);
    public hasSelectedTickets = computed(() => this.selectedTickets().length > 0);
    public selectedTicketsCount = computed(() => this.selectedTickets().length);

    // BehaviorSubjects for reactive data
    private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
    public tickets$ = this.ticketsSubject.asObservable();

    constructor() {
        this.generateMockData();
    }

    /**
     * Busca tickets com filtros e paginação
     */
    public getTickets(request: TicketListRequest): Observable<TicketListResponse> {
        this.loading.set(true);
        this.error.set(null);

        return of(null).pipe(
            delay(800), // Simula latência de rede
            map(() => {
                const mockTickets = this.getMockTickets();

                // Aplicar filtros
                let filteredTickets = this.applyFilters(mockTickets, request.filters);

                // Aplicar ordenação
                if (request.sort) {
                    filteredTickets = this.applySorting(filteredTickets, request.sort);
                }

                // Aplicar paginação
                const total = filteredTickets.length;
                const startIndex = (request.page - 1) * request.pageSize;
                const endIndex = startIndex + request.pageSize;
                const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

                const response: TicketListResponse = {
                    tickets: paginatedTickets,
                    total,
                    page: request.page,
                    pageSize: request.pageSize,
                    totalPages: Math.ceil(total / request.pageSize),
                    hasNext: endIndex < total,
                    hasPrevious: request.page > 1
                };

                // Atualizar estado
                this.tickets.set(paginatedTickets);
                this.totalTickets.set(total);
                this.currentPage.set(request.page);
                this.pageSize.set(request.pageSize);
                this.loading.set(false);

                this.ticketsSubject.next(paginatedTickets);

                return response;
            })
        );
    }

    /**
     * Busca um ticket por ID
     */
    public getTicketById(id: string): Observable<Ticket | null> {
        this.loading.set(true);

        return of(null).pipe(
            delay(300),
            map(() => {
                const ticket = this.getMockTickets().find(t => t.id === id);
                this.loading.set(false);
                return ticket || null;
            })
        );
    }

    /**
     * Cria um novo ticket
     */
    public createTicket(request: CreateTicketRequest): Observable<Ticket> {
        this.loading.set(true);

        return of(null).pipe(
            delay(1000),
            map(() => {
                const newTicket: Ticket = {
                    id: `TK-${Date.now()}`,
                    title: request.title,
                    description: request.description,
                    status: TicketStatus.OPEN,
                    priority: request.priority,
                    category: request.category,
                    assignee: request.assignee ? this.getMockUsers().find(u => u.id === request.assignee) : undefined,
                    reporter: this.getCurrentUser(), // Mock current user
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lastActivity: new Date(),
                    dueDate: request.dueDate,
                    tags: request.tags,
                    attachments: [],
                    comments: [],
                    estimatedHours: request.estimatedHours,
                    department: request.department,
                    isUrgent: request.priority === TicketPriority.CRITICAL
                };

                this.loading.set(false);
                return newTicket;
            })
        );
    }

    /**
     * Atualiza um ticket
     */
    public updateTicket(id: string, request: UpdateTicketRequest): Observable<Ticket> {
        this.loading.set(true);

        return of(null).pipe(
            delay(800),
            map(() => {
                const tickets = this.getMockTickets();
                const ticketIndex = tickets.findIndex(t => t.id === id);

                if (ticketIndex === -1) {
                    throw new Error('Ticket não encontrado');
                }

                const existingTicket = tickets[ticketIndex];
                const updatedTicket: Ticket = {
                    ...existingTicket,
                    title: request.title ?? existingTicket.title,
                    description: request.description ?? existingTicket.description,
                    status: request.status ?? existingTicket.status,
                    priority: request.priority ?? existingTicket.priority,
                    category: request.category ?? existingTicket.category,
                    assignee: request.assignee ? this.getMockUsers().find(u => u.id === request.assignee) : existingTicket.assignee,
                    dueDate: request.dueDate ?? existingTicket.dueDate,
                    tags: request.tags ?? existingTicket.tags,
                    estimatedHours: request.estimatedHours ?? existingTicket.estimatedHours,
                    department: request.department ?? existingTicket.department,
                    updatedAt: new Date(),
                    lastActivity: new Date()
                };

                this.loading.set(false);
                return updatedTicket;
            })
        );
    }

    /**
     * Executa ações em lote
     */
    public bulkAction(action: BulkTicketAction): Observable<void> {
        this.loading.set(true);

        return of(null).pipe(
            delay(1500),
            map(() => {
                console.log('Bulk action executed:', action);
                this.loading.set(false);
                this.selectedTickets.set([]);
            })
        );
    }

    /**
     * Gerencia seleção de tickets
     */
    public toggleTicketSelection(ticketId: string): void {
        const selected = this.selectedTickets();
        const index = selected.indexOf(ticketId);

        if (index > -1) {
            this.selectedTickets.set(selected.filter(id => id !== ticketId));
        } else {
            this.selectedTickets.set([...selected, ticketId]);
        }
    }

    public selectAllTickets(): void {
        const allIds = this.tickets().map(t => t.id);
        this.selectedTickets.set(allIds);
    }

    public clearSelection(): void {
        this.selectedTickets.set([]);
    }

    public isTicketSelected(ticketId: string): boolean {
        return this.selectedTickets().includes(ticketId);
    }

    /**
     * Estatísticas de tickets
     */
    public getTicketStats(): Observable<any> {
        return of(null).pipe(
            delay(500),
            map(() => {
                const tickets = this.getMockTickets();

                return {
                    total: tickets.length,
                    open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
                    inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
                    pending: tickets.filter(t => t.status === TicketStatus.PENDING).length,
                    resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
                    closed: tickets.filter(t => t.status === TicketStatus.CLOSED).length,
                    urgent: tickets.filter(t => t.isUrgent).length,
                    overdue: tickets.filter(t => t.dueDate && t.dueDate < new Date() &&
                        ![TicketStatus.RESOLVED, TicketStatus.CLOSED].includes(t.status)).length
                };
            })
        );
    }

    /**
     * Métodos privados para dados mock
     */
    private getMockTickets(): Ticket[] {
        // Retorna dados mock dos tickets
        return this.mockTickets;
    }

    private getMockUsers(): User[] {
        return [
            {
                id: '1',
                firstName: 'Admin',
                lastName: 'Sistema',
                email: 'admin@helpdesk.com',
                role: UserRole.ADMIN,
                department: 'TI',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                firstName: 'João',
                lastName: 'Silva',
                email: 'joao.silva@empresa.com',
                role: UserRole.AGENT,
                department: 'Suporte',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                firstName: 'Maria',
                lastName: 'Santos',
                email: 'maria.santos@empresa.com',
                role: UserRole.USER,
                department: 'Vendas',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }

    private getCurrentUser(): User {
        return this.getMockUsers()[0]; // Mock current user
    }

    private applyFilters(tickets: Ticket[], filters?: any): Ticket[] {
        if (!filters) return tickets;

        return tickets.filter(ticket => {
            // Implementar lógica de filtros
            if (filters.status && !filters.status.includes(ticket.status)) return false;
            if (filters.priority && !filters.priority.includes(ticket.priority)) return false;
            if (filters.category && !filters.category.includes(ticket.category)) return false;
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                return ticket.title.toLowerCase().includes(searchTerm) ||
                    ticket.description.toLowerCase().includes(searchTerm) ||
                    ticket.id.toLowerCase().includes(searchTerm);
            }
            return true;
        });
    }

    private applySorting(tickets: Ticket[], sort: any): Ticket[] {
        return tickets.sort((a, b) => {
            const aValue = a[sort.field as keyof Ticket];
            const bValue = b[sort.field as keyof Ticket];

            // Handle undefined values
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return sort.direction === 'asc' ? 1 : -1;
            if (bValue === undefined) return sort.direction === 'asc' ? -1 : 1;

            if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    private generateMockData(): void {
        // Mock data será gerada aqui
    }

    // Dados mock de tickets
    private mockTickets: Ticket[] = [
        {
            id: 'TK-001',
            title: 'Problema com login no sistema',
            description: 'Usuário não consegue fazer login na aplicação principal. Erro 401 sendo retornado.',
            status: TicketStatus.OPEN,
            priority: TicketPriority.HIGH,
            category: TicketCategory.TECHNICAL_SUPPORT,
            reporter: this.getMockUsers()[2],
            assignee: this.getMockUsers()[1],
            createdAt: new Date('2025-01-08'),
            updatedAt: new Date('2025-01-08'),
            lastActivity: new Date('2025-01-08'),
            dueDate: new Date('2025-01-15'),
            tags: ['login', 'authentication', 'urgent'],
            attachments: [],
            comments: [],
            estimatedHours: 4,
            department: 'TI',
            isUrgent: true
        },
        {
            id: 'TK-002',
            title: 'Erro ao gerar relatório mensal',
            description: 'Sistema apresenta erro 500 ao tentar gerar relatório mensal de vendas.',
            status: TicketStatus.IN_PROGRESS,
            priority: TicketPriority.MEDIUM,
            category: TicketCategory.BUG_REPORT,
            reporter: this.getMockUsers()[2],
            assignee: this.getMockUsers()[1],
            createdAt: new Date('2025-01-07'),
            updatedAt: new Date('2025-01-09'),
            lastActivity: new Date('2025-01-09'),
            dueDate: new Date('2025-01-20'),
            tags: ['relatório', 'bug', 'vendas'],
            attachments: [],
            comments: [],
            estimatedHours: 8,
            department: 'TI',
            isUrgent: false
        },
        {
            id: 'TK-003',
            title: 'Solicitação de nova funcionalidade - Dashboard',
            description: 'Solicitação para adicionar widget de gráfico de barras no dashboard principal.',
            status: TicketStatus.PENDING,
            priority: TicketPriority.LOW,
            category: TicketCategory.FEATURE_REQUEST,
            reporter: this.getMockUsers()[2],
            createdAt: new Date('2025-01-06'),
            updatedAt: new Date('2025-01-06'),
            lastActivity: new Date('2025-01-06'),
            tags: ['dashboard', 'feature', 'gráfico'],
            attachments: [],
            comments: [],
            estimatedHours: 16,
            department: 'Desenvolvimento',
            isUrgent: false
        }
        // Adicionar mais tickets mock conforme necessário
    ];
}
