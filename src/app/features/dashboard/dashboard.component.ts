import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Import des composants
import { NavbarComponent } from '../../shared/components/dashboard/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/dashboard/sidebar.component';
import { ArticleCardComponent } from '../../shared/components/dashboard/article-card.component';


// Import des services
import { FeedRssService, NewsFeed, ArticleItem } from '../../core/services/feedRss/feed-rss.service';
import { AuthService } from '../../core/services/auth/auth.service';

interface ProcessedArticle {
  article: ArticleItem;
  source: string;
  categoryId: number;
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
    ArticleCardComponent
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
  newsFeeds: NewsFeed[] = [];
  allArticles: ProcessedArticle[] = [];
  filteredArticles: ProcessedArticle[] = [];
  
  constructor(
    private feedRssService: FeedRssService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadSubscribedArticles();
  }
  
  loadSubscribedArticles(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.feedRssService.getAllSubscribedArticles().subscribe({
      next: (feeds) => {
        this.newsFeeds = feeds;
        this.processNewsFeeds();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.errorMessage = 'Impossible de charger vos articles. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }
  
  processNewsFeeds(): void {
    this.allArticles = [];
    
    // Traiter chaque flux d'actualités
    this.newsFeeds.forEach(feed => {
      // Utiliser le titre du flux comme nom de la source
      const sourceName = feed.title;
      
      // Ajouter chaque article au tableau allArticles avec les métadonnées
      feed.items.forEach(article => {
        this.allArticles.push({
          article,
          source: sourceName,
          categoryId: feed.category_id
        });
      });
    });
    
    // Trier les articles par date (le plus récent d'abord)
    this.allArticles.sort((a, b) => {
      return new Date(b.article.isoDate).getTime() - new Date(a.article.isoDate).getTime();
    });
    
    // Mettre à jour le compteur d'articles
    this.newArticlesCount = this.allArticles.length;
    
    // Appliquer les filtres
    this.applyFilters();
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  navigateDay(direction: number): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + direction);
    this.currentDate = newDate;
    
    // Recharger les articles pour la nouvelle date
    // Note: Cette fonctionnalité nécessiterait une API supportant la filtration par date
    this.loadSubscribedArticles();
  }
  
  applyFilters(): void {
    // Filtrer les articles en fonction des sélections
    this.filteredArticles = this.allArticles.filter(item => {
      let matchesTheme = true;
      let matchesSource = true;
      
      // Filtrer par thème (catégorie)
      if (this.selectedTheme !== 'all') {
        matchesTheme = item.categoryId.toString() === this.selectedTheme;
      }
      
      // Filtrer par source
      if (this.selectedSource !== 'all') {
        // Comparer le nom de la source ou l'ID de la source selon ce qui est disponible
        const feedId = this.getFeedIdByTitle(item.source);
        matchesSource = feedId.toString() === this.selectedSource;
      }
      
      return matchesTheme && matchesSource;
    });
  }
  
  getFeedIdByTitle(title: string): number {
    // Trouver le feed_id correspondant au titre
    const feed = this.newsFeeds.find(f => f.title === title);
    return feed ? feed.feed_id : 0;
  }
  
  loadMoreArticles(): void {
    // Implémentation future pour la pagination
    console.log('Charger plus d\'articles');
  }
}