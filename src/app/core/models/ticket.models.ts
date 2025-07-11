export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    assignee?: User;
    reporter: User;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    resolvedAt?: Date;
    tags: string[];
    attachments: Attachment[];
    comments: Comment[];
    estimatedHours?: number;
    actualHours?: number;
    department?: string;
    isUrgent: boolean;
    satisfactionRating?: number;
    lastActivity: Date;
}

export enum TicketStatus {
    DRAFT = 'draft',
    OPEN = 'open',
    IN_PROGRESS = 'in-progress',
    PENDING = 'pending',
    ON_HOLD = 'on-hold',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
    CANCELLED = 'cancelled'
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum TicketCategory {
    TECHNICAL_SUPPORT = 'technical-support',
    BUG_REPORT = 'bug-report',
    FEATURE_REQUEST = 'feature-request',
    GENERAL_INQUIRY = 'general-inquiry',
    ACCOUNT_ISSUE = 'account-issue',
    BILLING = 'billing',
    TRAINING = 'training',
    MAINTENANCE = 'maintenance'
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: UserRole;
    department?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserRole {
    ADMIN = 'admin',
    AGENT = 'agent',
    USER = 'user'
}

export interface Attachment {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
}

export interface Comment {
    id: string;
    content: string;
    author: User;
    createdAt: Date;
    updatedAt?: Date;
    isInternal: boolean;
    attachments: Attachment[];
    mentions: string[];
}

export interface TicketFilters {
    status?: TicketStatus[];
    priority?: TicketPriority[];
    category?: TicketCategory[];
    assignee?: string[];
    reporter?: string[];
    department?: string[];
    tags?: string[];
    dateRange?: {
        start?: Date;
        end?: Date;
        field: 'createdAt' | 'updatedAt' | 'dueDate' | 'resolvedAt';
    };
    search?: string;
    isUrgent?: boolean;
    hasAttachments?: boolean;
    hasComments?: boolean;
}

export interface TicketSortOptions {
    field: keyof Ticket;
    direction: 'asc' | 'desc';
}

export interface TicketListRequest {
    page: number;
    pageSize: number;
    filters?: TicketFilters;
    sort?: TicketSortOptions;
}

export interface TicketListResponse {
    tickets: Ticket[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface CreateTicketRequest {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    assignee?: string;
    department?: string;
    tags: string[];
    attachments?: File[];
    dueDate?: Date;
    estimatedHours?: number;
}

export interface UpdateTicketRequest {
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignee?: string;
    department?: string;
    tags?: string[];
    dueDate?: Date;
    estimatedHours?: number;
}

export interface BulkTicketAction {
    action: 'assign' | 'status' | 'priority' | 'category' | 'tag' | 'delete';
    ticketIds: string[];
    value?: any;
}

export enum BulkActionType {
    STATUS_CHANGE = 'status',
    PRIORITY_CHANGE = 'priority',
    ASSIGN = 'assign',
    DELETE = 'delete',
    TAG = 'tag',
    CATEGORY = 'category'
}

// Utility types for display
export type TicketStatusLabel = {
    [K in TicketStatus]: string;
};

export type TicketPriorityLabel = {
    [K in TicketPriority]: string;
};

export type TicketCategoryLabel = {
    [K in TicketCategory]: string;
};

// Constants for labels
export const TICKET_STATUS_LABELS: TicketStatusLabel = {
    [TicketStatus.DRAFT]: 'Rascunho',
    [TicketStatus.OPEN]: 'Aberto',
    [TicketStatus.IN_PROGRESS]: 'Em Andamento',
    [TicketStatus.PENDING]: 'Pendente',
    [TicketStatus.ON_HOLD]: 'Em Espera',
    [TicketStatus.RESOLVED]: 'Resolvido',
    [TicketStatus.CLOSED]: 'Fechado',
    [TicketStatus.CANCELLED]: 'Cancelado'
};

export const TICKET_PRIORITY_LABELS: TicketPriorityLabel = {
    [TicketPriority.LOW]: 'Baixa',
    [TicketPriority.MEDIUM]: 'Média',
    [TicketPriority.HIGH]: 'Alta',
    [TicketPriority.CRITICAL]: 'Crítica'
};

export const TICKET_CATEGORY_LABELS: TicketCategoryLabel = {
    [TicketCategory.TECHNICAL_SUPPORT]: 'Suporte Técnico',
    [TicketCategory.BUG_REPORT]: 'Relatório de Bug',
    [TicketCategory.FEATURE_REQUEST]: 'Solicitação de Funcionalidade',
    [TicketCategory.GENERAL_INQUIRY]: 'Consulta Geral',
    [TicketCategory.ACCOUNT_ISSUE]: 'Problema de Conta',
    [TicketCategory.BILLING]: 'Cobrança',
    [TicketCategory.TRAINING]: 'Treinamento',
    [TicketCategory.MAINTENANCE]: 'Manutenção'
};

// Labels consolidados para internacionalização
export const TICKET_LABELS = {
    title: 'Tickets',
    status: TICKET_STATUS_LABELS,
    priority: TICKET_PRIORITY_LABELS,
    category: TICKET_CATEGORY_LABELS
};
