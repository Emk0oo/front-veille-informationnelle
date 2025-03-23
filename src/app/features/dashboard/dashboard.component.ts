import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Import des composants
import { NavbarComponent } from '../../shared/components/dashboard/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/dashboard/sidebar.component';
import { ArticleCardComponent } from '../../shared/components/dashboard/article-card.component';

// Import des services
import { FeedRssService, Article, ArticleItem } from '../../core/services/feedRss/feed-rss.service';
import { AuthService } from '../../core/services/auth/auth.service';

interface ProcessedArticle {
  article: ArticleItem;
  source: string;
  categoryId: number;
}

interface Source {
  id: number;
  title: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    ArticleCardComponent,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // UI state
  isLoading: boolean = false;
  isMobileMenuOpen: boolean = false;
  errorMessage: string | null = null;
  
  // Stats
  newArticlesCount: number = 0;
  activeRegionsCount: number = 16; // Valeur statique pour démonstration
  riskZonesCount: number = 8; // Valeur statique pour démonstration
  alertsCount: number = 3; // Valeur statique pour démonstration
  
  // Date et filtres
  currentDate: Date = new Date();
  selectedTheme: string = 'all';
  selectedSource: string = 'all';
  
  // Articles
  articles: Article[] = [];
  allArticles: ProcessedArticle[] = [];
  filteredArticles: ProcessedArticle[] = [];
  
  // Sources distinctes extraites des articles
  sources: Source[] = [];
  
  constructor(
    private feedRssService: FeedRssService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Initialiser la date courante à aujourd'hui
    this.currentDate = new Date();
    
    // Charger les articles pour la date du jour
    this.loadArticlesByCurrentDate();
  }
  
  loadArticlesByCurrentDate(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Formater la date courante au format YYYY-MM-DD
    const formattedDate = this.formatDateToYYYYMMDD(this.currentDate);
    
    this.feedRssService.getAllSubscribedArticlesByDate(formattedDate).subscribe({
      next: (articles) => {
        console.log('Articles chargés pour la date:', formattedDate);
        console.log('Articles:', articles);
        this.articles = articles;
        this.extractSources();
        this.processArticles();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.errorMessage = 'Impossible de charger vos articles. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }
  
  // Extraire les sources distinctes à partir des articles
  extractSources(): void {
    // Créer un ensemble pour stocker les IDs uniques et éviter les doublons
    const uniqueSourceIds = new Set<number>();
    const tempSources: Source[] = [];
    
    // Parcourir tous les articles et ajouter leurs sources s'ils ne sont pas déjà présents
    this.articles.forEach(article => {
      if (!uniqueSourceIds.has(article.feed_id)) {
        uniqueSourceIds.add(article.feed_id);
        
        // Obtenir le titre de la source depuis le service ou utiliser un titre par défaut
        const sourceTitle = this.feedRssService.getSourceNameById(article.feed_id);
        
        tempSources.push({
          id: article.feed_id,
          title: sourceTitle
        });
      }
    });
    
    // Trier les sources par ID
    this.sources = tempSources.sort((a, b) => a.id - b.id);
  }
  
  navigateDay(direction: number): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + direction);
    this.currentDate = newDate;
    
    // Utiliser la fonction loadArticlesByCurrentDate pour éviter la duplication de code
    this.loadArticlesByCurrentDate();
  }
  
  processArticles(): void {
    this.allArticles = [];
    
    // Vérification que articles est un tableau valide
    if (!Array.isArray(this.articles) || this.articles.length === 0) {
      this.newArticlesCount = 0;
      this.filteredArticles = [];
      return;
    }
    
    // Traitement des articles retournés par l'API
    this.articles.forEach(article => {
      // Adapter chaque article au format ArticleItem pour la compatibilité avec ArticleCardComponent
      this.allArticles.push({
        article: {
          title: article.title,
          link: article.link,
          content: article.content,
          contentSnippet: article.content_snippet,
          guid: article.guid,
          isoDate: article.iso_date,
          published_at: article.published_at,
          imageUrl: article.image_url
        },
        source: this.feedRssService.getSourceNameById(article.feed_id),
        categoryId: article.category_id || 0
      });
    });
    
    // Trier les articles par date (le plus récent d'abord)
    this.allArticles.sort((a, b) => {
      const dateA = new Date(a.article.isoDate || a.article.published_at || '');
      const dateB = new Date(b.article.isoDate || b.article.published_at || '');
      return dateB.getTime() - dateA.getTime();
    });
    
    // Mettre à jour le compteur d'articles
    this.newArticlesCount = this.allArticles.length;
    
    // Appliquer les filtres
    this.applyFilters();
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  // Fonction utilitaire pour formater la date en YYYY-MM-DD
  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 car les mois commencent à 0
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  applyFilters(): void {
    // Filtrer les articles en fonction des sélections
    this.filteredArticles = this.allArticles.filter(item => {
      let matchesTheme = true;
      let matchesSource = true;
      
      // Filtrer par thème (catégorie)
      if (this.selectedTheme !== 'all') {
        matchesTheme = item.categoryId?.toString() === this.selectedTheme;
      }
      
      // Filtrer par source
      if (this.selectedSource !== 'all') {
        // Trouver la source correspondant à l'ID
        const sourceArticle = this.articles.find(a => a.feed_id.toString() === this.selectedSource);
        if (sourceArticle) {
          // Vérifier si l'article provient de cette source
          matchesSource = item.article.guid.includes(sourceArticle.guid.split('/')[2]);
        }
      }
      
      return matchesTheme && matchesSource;
    });
  }
  
  loadMoreArticles(): void {
    // Implémentation future pour la pagination
    console.log('Charger plus d\'articles');
  }
}