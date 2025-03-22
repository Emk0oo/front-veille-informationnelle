import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  isActive: boolean;
}

interface Subscription {
  name: string;
  colorClass: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    {
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      label: 'Tableau de bord',
      route: '/dashboard',
      isActive: true
    },
    {
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
      label: 'Actualités',
      route: '/news',
      isActive: false
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      label: 'Analyses',
      route: '/analysis',
      isActive: false
    },
    {
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      label: 'Zones à risque',
      route: '/risk-zones',
      isActive: false
    }
  ];

  subscriptions: Subscription[] = [
    { name: 'Le Monde', colorClass: 'bg-blue-500', route: '#' },
    { name: 'France 24', colorClass: 'bg-green-500', route: '#' },
    { name: 'BBC News', colorClass: 'bg-red-500', route: '#' },
    { name: 'Reuters', colorClass: 'bg-yellow-500', route: '#' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Détecter la route actuelle et mettre à jour isActive
    this.updateActiveRoute(window.location.pathname);
  }

  updateActiveRoute(currentPath: string): void {
    this.navItems.forEach(item => {
      item.isActive = item.route === currentPath;
    });
  }

  navigateTo(route: string): void {
    // Mettre à jour l'élément actif
    this.updateActiveRoute(route);
  }

  manageSubscriptions(): void {
    // Logique pour gérer les abonnements
    console.log('Gérer les abonnements');
  }
}