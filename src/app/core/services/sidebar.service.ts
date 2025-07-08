import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private isMobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
    public isMobileMenuOpen$ = this.isMobileMenuOpenSubject.asObservable();

    private isDesktopCollapsedSubject = new BehaviorSubject<boolean>(false);
    public isDesktopCollapsed$ = this.isDesktopCollapsedSubject.asObservable();

    toggleMobileMenu(): void {
        this.isMobileMenuOpenSubject.next(!this.isMobileMenuOpenSubject.value);
    }

    closeMobileMenu(): void {
        this.isMobileMenuOpenSubject.next(false);
    }

    openMobileMenu(): void {
        this.isMobileMenuOpenSubject.next(true);
    }

    toggleDesktopSidebar(): void {
        this.isDesktopCollapsedSubject.next(!this.isDesktopCollapsedSubject.value);
    }

    get isMobileMenuOpen(): boolean {
        return this.isMobileMenuOpenSubject.value;
    }

    get isDesktopCollapsed(): boolean {
        return this.isDesktopCollapsedSubject.value;
    }
}
