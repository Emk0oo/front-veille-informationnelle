import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUserMenuOpen: boolean = false;
  showNotifications: boolean = false;
  searchQuery: string = '';
  userInitials: string = 'JS'; // Initiales de l'utilisateur
  
  notifications: Notification[] = [
    {
      id: 1,
      title: 'Alerte Géopolitique',
      message: 'Nouvelle situation de conflit détectée en Europe de l\'Est.',
      time: 'Il y a 10 minutes',
      isRead: false
    },
    {
      id: 2,
      title: 'Mise à jour de l\'application',
      message: 'GeoWatch a été mis à jour vers la version 2.1.0',
      time: 'Il y a 1 heure',
      isRead: true
    },
    {
      id: 3,
      title: 'Nouvelle source disponible',
      message: 'Al Jazeera a été ajouté comme source d\'information.',
      time: 'Il y a 2 heures',
      isRead: false
    }
  ];

  get notificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialisation
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    // Fermer le menu de l'utilisateur si on clique à l'extérieur
    const userMenuButton = document.querySelector('.user-menu-button');
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenuButton && !userMenuButton.contains(event.target as Node) && 
        userMenu && !userMenu.contains(event.target as Node)) {
      this.isUserMenuOpen = false;
    }
    
    // Fermer le panneau de notifications si on clique à l'extérieur
    const notifButton = document.querySelector('.notif-button');
    const notifPanel = document.querySelector('.notif-panel');
    
    if (notifButton && !notifButton.contains(event.target as Node) && 
        notifPanel && !notifPanel.contains(event.target as Node)) {
      this.showNotifications = false;
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    // Fermer les notifications si elles sont ouvertes
    if (this.isUserMenuOpen) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    // Fermer le menu utilisateur s'il est ouvert
    if (this.showNotifications) {
      this.isUserMenuOpen = false;
    }
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  }

  search(): void {
    console.log(`Recherche: ${this.searchQuery}`);
    // Implémenter la recherche ici
    this.searchQuery = '';
  }

  viewAllNotifications(): void {
    console.log('Voir toutes les notifications');
    // Naviguer vers la page des notifications
  }

  logout(): void {
    this.authService.logout();
  }
}