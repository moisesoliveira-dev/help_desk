import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SidebarService } from '../core/services/sidebar.service';
import { ThemeSelectorComponent } from '../shared/theme-selector/theme-selector.component';
import { GlobalSearchComponent } from '../shared/components/global-search/global-search.component';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models/auth.models';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink, ThemeSelectorComponent, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  showUserMenu = false;
  showNotifications = false;

  // Reactive computed properties from AuthService
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => this.authService.currentUser());

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar tema salvo no localStorage
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();

    // Fechar menus ao clicar fora
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.showUserMenu = false;
        this.showNotifications = false;
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggleMobileMenu();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyTheme();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/auth/login']);
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
