import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarService } from '../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentRoute = '';
  ticketCount = 23;
  isMobileSidebarOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    // Monitorar mudanças de rota
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    // Definir rota inicial
    this.currentRoute = this.router.url;

    // Monitorar estado do sidebar mobile
    this.sidebarService.isMobileMenuOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isMobileSidebarOpen = isOpen;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  closeMobileSidebar(): void {
    this.sidebarService.closeMobileMenu();
  }

  onBackdropClick(): void {
    this.closeMobileSidebar();
  }
}
