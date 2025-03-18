import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  private isBrowser: boolean;
  
  // Données pour les statistiques
  statCards = [
    {
      title: 'Sources de données',
      value: 'APPEL API',
      description: 'Sources vérifiées de média nationaux et internationaux'
    },
    {
      title: 'Continent couvert',
      value: '6',
      description: 'Couverture mondiale pour une analyse globale'
    },
    {
      title: 'Mise à jour quotidienne',
      value: 'Toutes les 10 min',
      description: 'Arrivé des nouvelles en quasi-instantannées'
    },
    {
      title: '-',
      value: '0',
      description: '-'
    }
  ];

  // Données pour les risques de conflit
  conflictRisks = [
    { region: 'Europe de l\'Est', level: 'Critique', percentage: 85, color: 'red' },
    { region: 'Moyen-Orient', level: 'Élevée', percentage: 70, color: 'orange' },
    { region: 'Mer de Chine méridionale', level: 'Élevée', percentage: 65, color: 'orange' },
    { region: 'Corne de l\'Afrique', level: 'Modéré', percentage: 45, color: 'yellow' },
    { region: 'Amérique centrale', level: 'Modéré', percentage: 40, color: 'yellow' }
  ];

  // Données pour l'indice de stabilité économique
  economicStability = [
    { region: 'Amérique du Nord', level: 'Stable', percentage: 75, color: 'green' },
    { region: 'Europe de l\'Ouest', level: 'Stable', percentage: 70, color: 'green' },
    { region: 'Asie de l\'Est', level: 'Modéré', percentage: 65, color: 'yellow' },
    { region: 'Amérique du Sud', level: 'Instable', percentage: 40, color: 'orange' },
    { region: 'Afrique subsaharienne', level: 'Critique', percentage: 25, color: 'red' }
  ];

  // Données pour les barres du graphique
  chartBars = [
    { region: 'Moyen Orient', left: '5%', height: '65%', color: '#ef4444' },
    { region: 'Europe', left: '15%', height: '45%', color: '#f97316' },
    { region: 'Afrique', left: '25%', height: '30%', color: '#eab308' },
    { region: 'Asie central', left: '35%', height: '80%', color: '#ef4444' },
    { region: 'Asie de l\'Est', left: '45%', height: '20%', color: '#22c55e' },
    { region: 'Asie du Sud', left: '55%', height: '40%', color: '#f97316' },
    { region: 'Amérique du Nord', left: '65%', height: '55%', color: '#f97316' },
    { region: 'Amérique du Sud', left: '75%', height: '25%', color: '#eab308' },
    { region: 'Océanie', left: '85%', height: '35%', color: '#eab308' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Aucune initialisation côté serveur requise
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Exécuter avec un léger délai pour s'assurer que le DOM est complètement chargé
      setTimeout(() => {
        if (this.isBrowser) {
          this.initializeChartBars();
        }
      }, 300);
    }
  }

  // Animation des barres du graphique
  private initializeChartBars(): void {
    if (!this.isBrowser) return;
    
    const bars = document.querySelectorAll('.chart-bar');
    
    bars.forEach(bar => {
      const height = (bar as HTMLElement).style.height;
      (bar as HTMLElement).style.height = '0';
      
      setTimeout(() => {
        if (this.isBrowser) {
          (bar as HTMLElement).style.height = height;
        }
      }, 300);
    });
  }

  // Méthode pour obtenir la classe CSS de couleur en fonction du niveau de risque
  getColorClass(color: string): string {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  // Méthode pour obtenir la classe CSS de couleur de texte en fonction du niveau de risque
  getTextColorClass(color: string): string {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'orange': return 'text-orange-500';
      case 'yellow': return 'text-yellow-500';
      case 'green': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }
}