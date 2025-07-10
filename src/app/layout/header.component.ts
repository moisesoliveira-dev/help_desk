import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../core/services/sidebar.service';
import { ThemeSelectorComponent } from '../shared/theme-selector/theme-selector.component';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink, ThemeSelectorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  searchTerm = '';
  isDarkMode = false;
  showUserMenu = false;
  showNotifications = false;

  currentUser: User = {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@helpdesk.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Administrador'
  };

  constructor(private sidebarService: SidebarService) { }

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

  onSearch(): void {
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm);
      // TODO: Implementar busca
    }
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
    console.log('Logout');
    // TODO: Implementar logout
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
