import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  
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

  constructor() {}

  ngOnInit(): void {
    // Pas d'initialisation nécessaire puisque nous utilisons une approche statique
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