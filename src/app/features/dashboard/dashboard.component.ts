import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SearchService } from '../../core/services/search.service';
import { StatWidgetComponent } from '../../shared/components/widgets/stat-widget.component';
import { ChartWidgetComponent } from '../../shared/components/widgets/chart-widget.component';
import { AdvancedFiltersComponent } from '../../shared/components/advanced-filters/advanced-filters.component';

interface DashboardStats {
    totalTickets: number;
    openTickets: number;
    closedTickets: number;
    pendingTickets: number;
    avgResponseTime: string;
    customerSatisfaction: number;
}

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink, StatWidgetComponent, ChartWidgetComponent, AdvancedFiltersComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    // Estado dos filtros
    showAdvancedFilters = false;

    // Dados estatísticos simulados
    stats: DashboardStats = {
        totalTickets: 1847,
        openTickets: 23,
        closedTickets: 1756,
        pendingTickets: 68,
        avgResponseTime: '2h 15m',
        customerSatisfaction: 4.8
    };

    // Dados dos gráficos simulados
    ticketsByDay = [
        { label: 'Seg', value: 45, color: '#3B82F6' },
        { label: 'Ter', value: 52, color: '#8B5CF6' },
        { label: 'Qua', value: 38, color: '#06D6A0' },
        { label: 'Qui', value: 67, color: '#F59E0B' },
        { label: 'Sex', value: 43, color: '#EF4444' },
        { label: 'Sáb', value: 21, color: '#84CC16' },
        { label: 'Dom', value: 15, color: '#6B7280' }
    ];

    ticketsByStatus = [
        { label: 'Abertos', value: this.stats.openTickets, color: '#EF4444' },
        { label: 'Em Andamento', value: 45, color: '#8B5CF6' },
        { label: 'Pendentes', value: this.stats.pendingTickets, color: '#F59E0B' },
        { label: 'Fechados', value: this.stats.closedTickets, color: '#06D6A0' }
    ];

    ticketsByPriority = [
        { label: 'Alta', value: 12, color: '#EF4444' },
        { label: 'Média', value: 45, color: '#F59E0B' },
        { label: 'Baixa', value: 23, color: '#06D6A0' }
    ];

    recentTickets = [
        {
            id: '#TK-001',
            title: 'Problema com login no sistema',
            user: 'Maria Silva',
            priority: 'high',
            status: 'open',
            time: '5 min atrás'
        },
        {
            id: '#TK-002',
            title: 'Erro ao gerar relatório mensal',
            user: 'João Santos',
            priority: 'medium',
            status: 'in-progress',
            time: '15 min atrás'
        },
        {
            id: '#TK-003',
            title: 'Solicitação de nova funcionalidade',
            user: 'Ana Costa',
            priority: 'low',
            status: 'pending',
            time: '1h atrás'
        },
        {
            id: '#TK-004',
            title: 'Problema de performance no dashboard',
            user: 'Carlos Lima',
            priority: 'high',
            status: 'open',
            time: '2h atrás'
        }
    ];

    // Dados reativos do usuário
    currentUser = computed(() => this.authService.currentUser());
    userRole = computed(() => this.currentUser()?.role);

    constructor(
        private authService: AuthService,
        private searchService: SearchService
    ) { }

    ngOnInit(): void {
        // Simula carregamento de dados
        this.loadDashboardData();
    }

    private loadDashboardData(): void {
        // TODO: Implementar carregamento real dos dados da API
        console.log('Loading dashboard data...');
    }

    getPriorityClass(priority: string): string {
        const classes = {
            high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        };
        return classes[priority as keyof typeof classes] || classes.medium;
    }

    getStatusClass(status: string): string {
        const classes = {
            open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        };
        return classes[status as keyof typeof classes] || classes.open;
    }

    getStatusLabel(status: string): string {
        const labels = {
            open: 'Aberto',
            'in-progress': 'Em Andamento',
            pending: 'Pendente',
            closed: 'Fechado'
        };
        return labels[status as keyof typeof labels] || status;
    }

    getPriorityLabel(priority: string): string {
        const labels = {
            high: 'Alta',
            medium: 'Média',
            low: 'Baixa'
        };
        return labels[priority as keyof typeof labels] || priority;
    }

    toggleAdvancedFilters(): void {
        this.showAdvancedFilters = !this.showAdvancedFilters;
    }

    onFiltersChange(): void {
        // Atualizar dados baseado nos filtros
        this.loadDashboardData();
    }
}
