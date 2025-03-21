import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';
import { ArticleService } from '../../core/services/article/article.service';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Services
  private authService = inject(AuthService);
  private articleService = inject(ArticleService);
  private http = inject(HttpClient);
  
  // UI state variables
  isUserMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  
  // Data variables
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  // Filter variables
  selectedTheme: string = 'Tous les thèmes';
  selectedSource: string = 'Toutes les sources';
  currentDate: Date = new Date();
  
  // Stats
  newArticlesCount: number = 0;
  activeRegionsCount: number = 0;
  riskZonesCount: number = 0;
  alertsCount: number = 0;
  
  constructor() {}
  
  ngOnInit(): void {
    this.loadArticles();
    this.loadStats();
  }
  
  // UI methods
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  // Data loading methods
  loadArticles(): void {
    this.isLoading = true;
    this.articleService.getLatestArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = [...this.articles];
        this.isLoading = false;
        this.newArticlesCount = this.articles.length;
      },
      error: (error) => {
        this.errorMessage = 'Impossible de charger les articles. Veuillez réessayer plus tard.';
        this.isLoading = false;
        console.error('Erreur de chargement des articles:', error);
        
        // Pour la démo, créons des articles fictifs en cas d'erreur
        this.createMockArticles();
      }
    });
  }
  
  loadStats(): void {
    // Dans un cas réel, nous chargerions ces stats depuis une API
    // Pour la démo, on utilise des valeurs statiques
    this.newArticlesCount = 24;
    this.activeRegionsCount = 16;
    this.riskZonesCount = 8;
    this.alertsCount = 3;
  }
  
  // Filtering methods
  filterArticles(): void {
    this.filteredArticles = this.articles.filter(article => {
      let matchesTheme = true;
      let matchesSource = true;
      
      if (this.selectedTheme !== 'Tous les thèmes') {
        // Dans un cas réel, nous utiliserions une propriété de l'article
        // Pour la démo, nous filtrons par titre (qui contiendrait idéalement le thème)
        matchesTheme = article.title.toLowerCase().includes(this.selectedTheme.toLowerCase());
      }
      
      if (this.selectedSource !== 'Toutes les sources') {
        // Dans un cas réel, nous utiliserions une propriété de source dans l'article
        matchesSource = article.feed_id.toString() === this.selectedSource;
      }
      
      return matchesTheme && matchesSource;
    });
  }
  
  // Date navigation
  navigateDay(direction: number): void {
    // Ajouter ou soustraire un jour
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + direction);
    this.currentDate = newDate;
    
    // Dans un cas réel, nous rechargerions les articles pour cette date
    this.loadArticles();
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  
  // Helper methods pour la démo seulement
  private createMockArticles(): void {
    // Créer des articles fictifs pour la démo
    this.articles = [
      {
        id: 1,
        feed_id: 1,
        category_id: 1,
        title: 'Les négociations diplomatiques s\'intensifient dans le cadre du conflit en Ukraine',
        link: '#',
        content: 'Contenu détaillé de l\'article...',
        content_snippet: 'Les dirigeants européens se réunissent pour discuter de nouvelles mesures face aux récents développements dans le conflit ukrainien.',
        guid: 'guid1',
        iso_date: '2025-03-21T10:00:00Z',
        image_url: 'https://example.com/image1.jpg',
        published_at: '2025-03-21T10:00:00Z'
      },
      {
        id: 2,
        feed_id: 2,
        category_id: 2,
        title: 'Le FMI prévient d\'un ralentissement économique global',
        link: '#',
        content: 'Contenu détaillé de l\'article...',
        content_snippet: 'Dans son dernier rapport, le Fonds Monétaire International alerte sur les risques de récession dans plusieurs économies majeures.',
        guid: 'guid2',
        iso_date: '2025-03-21T08:00:00Z',
        image_url: 'https://example.com/image2.jpg',
        published_at: '2025-03-21T08:00:00Z'
      },
      {
        id: 3,
        feed_id: 3,
        category_id: 3,
        title: 'Nouvelles tensions à la frontière entre deux pays d\'Asie du Sud-Est',
        link: '#',
        content: 'Contenu détaillé de l\'article...',
        content_snippet: 'Des incidents militaires ont été rapportés à la frontière, suscitant des inquiétudes quant à une possible escalade des tensions.',
        guid: 'guid3',
        iso_date: '2025-03-21T06:00:00Z',
        image_url: 'https://example.com/image3.jpg',
        published_at: '2025-03-21T06:00:00Z'
      }
    ];
    this.filteredArticles = [...this.articles];
    this.isLoading = false;
  }
  
  getTimeAgo(dateString: string): string {
    const publishedDate = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  }
}