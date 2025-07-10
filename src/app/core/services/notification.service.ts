import { Injectable, signal } from '@angular/core';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    persistent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    public notifications = signal<Notification[]>([]);

    /**
     * Mostra uma notificação de sucesso
     */
    public success(title: string, message?: string, duration = 5000): void {
        this.addNotification({
            type: 'success',
            title,
            message,
            duration
        });
    }

    /**
     * Mostra uma notificação de erro
     */
    public error(title: string, message?: string, persistent = false): void {
        this.addNotification({
            type: 'error',
            title,
            message,
            duration: persistent ? undefined : 8000,
            persistent
        });
    }

    /**
     * Mostra uma notificação de aviso
     */
    public warning(title: string, message?: string, duration = 6000): void {
        this.addNotification({
            type: 'warning',
            title,
            message,
            duration
        });
    }

    /**
     * Mostra uma notificação informativa
     */
    public info(title: string, message?: string, duration = 5000): void {
        this.addNotification({
            type: 'info',
            title,
            message,
            duration
        });
    }

    /**
     * Remove uma notificação específica
     */
    public remove(id: string): void {
        this.notifications.update(notifications =>
            notifications.filter(n => n.id !== id)
        );
    }

    /**
     * Remove todas as notificações
     */
    public clear(): void {
        this.notifications.set([]);
    }

    private addNotification(notification: Omit<Notification, 'id'>): void {
        const id = this.generateId();
        const newNotification: Notification = { ...notification, id };

        this.notifications.update(notifications => [newNotification, ...notifications]);

        // Auto-remove se não for persistente
        if (!notification.persistent && notification.duration) {
            setTimeout(() => {
                this.remove(id);
            }, notification.duration);
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
