import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TicketService } from '../../core/services/ticket.service';
import {
    Ticket,
    TicketListRequest,
    TicketStatus,
    TicketPriority,
    BulkTicketAction,
    TICKET_LABELS
} from '../../core/models/ticket.models';

interface SortConfig {
    field: keyof Ticket;
    direction: 'asc' | 'desc';
}

@Component({
    selector: 'app-ticket-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Tickets
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie e acompanhe todos os tickets do sistema
              </p>
            </div>
            
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="btn-primary"
                (click)="createTicket()"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Novo Ticket
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div 
          *ngIf="ticketService.loading()" 
          class="flex items-center justify-center py-12"
        >
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600 dark:text-gray-400">Carregando tickets...</span>
        </div>

        <!-- Tickets Table -->
        <div 
          *ngIf="!ticketService.loading()"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Empty State -->
          <div 
            *ngIf="ticketService.tickets().length === 0"
            class="p-12 text-center"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum ticket encontrado</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Comece criando um novo ticket.
            </p>
          </div>

          <!-- Table -->
          <div 
            *ngIf="ticketService.tickets().length > 0"
            class="overflow-x-auto"
          >
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Título
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Criado em
                  </th>
                </tr>
              </thead>
              
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr 
                  *ngFor="let ticket of ticketService.tickets(); trackBy: trackByTicketId"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ ticket.id }}
                  </td>
                  
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white font-medium">
                      {{ ticket.title }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {{ ticket.description }}
                    </div>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getStatusClasses(ticket.status)"
                    >
                      {{ getStatusLabel(ticket.status) }}
                    </span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getPriorityClasses(ticket.priority)"
                    >
                      {{ getPriorityLabel(ticket.priority) }}
                    </span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div *ngIf="ticket.assignee" class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {{ ticket.assignee.firstName.charAt(0) }}{{ ticket.assignee.lastName.charAt(0) }}
                        </div>
                      </div>
                      <div class="ml-2">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ ticket.assignee.firstName }} {{ ticket.assignee.lastName }}
                        </div>
                      </div>
                    </div>
                    <span *ngIf="!ticket.assignee" class="text-gray-400 dark:text-gray-500">
                      Não atribuído
                    </span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ticket.createdAt | date:'dd/MM/yyyy HH:mm' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .btn-primary {
      @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
    }
  `]
})
export class TicketListComponent implements OnInit {
    public sortConfig = signal<SortConfig | null>(null);

    constructor(public ticketService: TicketService) { }

    ngOnInit(): void {
        this.loadTickets();
    }

    private loadTickets(): void {
        const request: TicketListRequest = {
            page: 1,
            pageSize: 10,
            sort: this.sortConfig() || undefined
        };

        this.ticketService.getTickets(request).subscribe();
    }

    public createTicket(): void {
        console.log('Navegar para criação de ticket');
    }

    public getStatusClasses(status: TicketStatus): string {
        const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

        switch (status) {
            case TicketStatus.OPEN:
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
            case TicketStatus.IN_PROGRESS:
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            case TicketStatus.PENDING:
                return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
            case TicketStatus.RESOLVED:
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case TicketStatus.CLOSED:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
        }
    }

    public getPriorityClasses(priority: TicketPriority): string {
        const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

        switch (priority) {
            case TicketPriority.LOW:
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case TicketPriority.MEDIUM:
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            case TicketPriority.HIGH:
                return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
            case TicketPriority.CRITICAL:
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
        }
    }

    public getStatusLabel(status: TicketStatus): string {
        return TICKET_LABELS.status[status] || status;
    }

    public getPriorityLabel(priority: TicketPriority): string {
        return TICKET_LABELS.priority[priority] || priority;
    }

    public trackByTicketId(index: number, ticket: Ticket): string {
        return ticket.id;
    }
}
