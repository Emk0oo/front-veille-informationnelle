import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../core/services/auth/auth.service';
import { FeedRssService, NewsFeed, ArticleItem } from '../../core/services/feedRss/feed-rss.service';
import { ArticleCardComponent } from '../../shared/components/dashboard/article-card.component';

interface FeedSource {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ArticleCardComponent, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Services
  private authService = inject(AuthService);
  private FeedRssService = inject(FeedRssService);
  private http = inject(HttpClient);
  
  // UI state variables
  isUserMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  
  // Data variables
  newsFeeds: NewsFeed[] = [];
  filteredFeeds: NewsFeed[] = [];
  allArticles: {article: ArticleItem, source: string, categoryId: number}[] = [];
  filteredArticles: {article: ArticleItem, source: string, categoryId: number}[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  // Filter variables
  selectedTheme: string = 'all';
  selectedSource: string = 'all';
  currentDate: Date = new Date();
  
  // Stats
  newArticlesCount: number = 0;
  activeRegionsCount: number = 0;
  riskZonesCount: number = 0;
  alertsCount: number = 0;
  
  // Pagination
  articlesPerPage: number = 6;
  currentPage: number = 1;
  
  // Sources et catégories
  sources: FeedSource[] = [
    { id: 1, name: 'Le Monde' },
    { id: 2, name: 'Franceinfo' },
    { id: 3, name: 'BBC News' },
    { id: 4, name: 'Reuters' },
    { id: 5, name: 'CNN' }
  ];
  
  categories: Category[] = [
    { id: 1, name: 'Politique' },
    { id: 2, name: 'Économie' },
    { id: 3, name: 'Conflits' },
    { id: 4, name: 'Environnement' },
    { id: 5, name: 'Technologie' },
    { id: 6, name: 'Société' }
  ];
  
  constructor() {}
  
  ngOnInit(): void {
    this.loadNewsFeeds();
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
  loadNewsFeeds(): void {
    this.isLoading = true;
    const dateStr = this.formatDateForApi(this.currentDate);
    
    this.FeedRssService.getFeedsByDate(dateStr).subscribe({
      next: (data) => {
        this.newsFeeds = data;
        this.processNewsFeeds();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Impossible de charger les actualités. Veuillez réessayer plus tard.';
        this.isLoading = false;
        console.error('Erreur de chargement des actualités:', error);
        
        // Pour la démo, créons des actualités fictives en cas d'erreur
        this.createMockNewsFeeds();
      }
    });
  }
  
  processNewsFeeds(): void {
    this.allArticles = [];
    
    this.newsFeeds.forEach(feed => {
      const sourceName = this.getSourceNameById(feed.feed_id);
      
      feed.items.forEach(article => {
        this.allArticles.push({
          article,
          source: sourceName,
          categoryId: feed.category_id
        });
      });
    });
    
    // Tri par date (plus récent d'abord)
    this.allArticles.sort((a, b) => {
      return new Date(b.article.isoDate).getTime() - new Date(a.article.isoDate).getTime();
    });
    
    this.applyFilters();
    this.newArticlesCount = this.allArticles.length;
  }
  
  loadStats(): void {
    // Dans un cas réel, nous chargerions ces stats depuis une API
    // Pour la démo, on utilise des valeurs statiques
    this.FeedRssService.getArticlesCount().subscribe({
      next: (count) => {
        this.newArticlesCount = count;
      },
      error: () => {
        this.newArticlesCount = 24; // Valeur par défaut
      }
    });
    
    this.activeRegionsCount = 16;
    this.riskZonesCount = 8;
    this.alertsCount = 3;
  }
  
  // Filtering methods
  applyFilters(): void {
    this.filteredArticles = this.allArticles.filter(item => {
      let matchesTheme = true;
      let matchesSource = true;
      
      if (this.selectedTheme !== 'all') {
        matchesTheme = item.categoryId.toString() === this.selectedTheme;
      }
      
      if (this.selectedSource !== 'all') {
        matchesSource = this.getSourceNameById(parseInt(this.selectedSource)) === item.source;
      }
      
      return matchesTheme && matchesSource;
    });
    
    // Réinitialiser la pagination lors d'un changement de filtre
    this.currentPage = 1;
  }
  
  // Date navigation
  navigateDay(direction: number): void {
    // Ajouter ou soustraire un jour
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + direction);
    this.currentDate = newDate;
    
    // Recharger les actualités pour cette date
    this.loadNewsFeeds();
  }
  
  // Pagination
  loadMoreArticles(): void {
    this.currentPage++;
  }
  
  get paginatedArticles(): {article: ArticleItem, source: string, categoryId: number}[] {
    const startIndex = 0;
    const endIndex = this.currentPage * this.articlesPerPage;
    return this.filteredArticles.slice(startIndex, endIndex);
  }
  
  get hasMoreArticles(): boolean {
    return this.currentPage * this.articlesPerPage < this.filteredArticles.length;
  }
  
  // Helper methods
  getSourceNameById(id: number): string {
    const source = this.sources.find(src => src.id === id);
    return source ? source.name : 'Source inconnue';
  }
  
  formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  formatDateForDisplay(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }
  
  // Méthodes pour la démo seulement
  private createMockNewsFeeds(): void {
    const mockNewsFeeds: NewsFeed[] = [
      {
        feed_id: 1,
        category_id: 3, // Conflits
        title: "International : Toute l'actualité sur Le Monde.fr.",
        items: [
          {
            title: "En direct, guerre à Gaza : l'armée israélienne dit avoir « frappé des terroristes » dans un hôpital désaffecté",
            link: "https://www.lemonde.fr/guerre-au-proche-orient/live/2025/03/21/en-direct-guerre-a-gaza-l-armee-israelienne-dit-avoir-frappe-des-terroristes-dans-un-hopital-desaffecte_6582862_6325529.html",
            pubDate: "Fri, 21 Mar 2025 22:20:47 +0100",
            mediaContent: [
              {
                $: {
                  width: "644",
                  height: "322",
                  url: "https://img.lemde.fr/2025/03/21/779/0/5760/2880/644/322/60/0/6bb96c5_sirius-fs-upload-1-r2w3pne3rbxj-1742562037118-105651.jpg"
                },
                'media:description': [
                  {
                    _: "Des Palestiniens fuient Beit Lahya, dans le nord de la bande de Gaza, le 21 mars 2025.",
                    $: {
                      type: "plain"
                    }
                  }
                ],
                'media:credit': [
                  {
                    _: "BASHAR TALEB / AFP",
                    $: {
                      scheme: "urn:ebu"
                    }
                  }
                ]
              }
            ],
            content: "La Turquie a condamné « fermement la destruction par Israël de l'Hôpital de l'amitié turco-palestinienne », dénonçant un « ciblage délibéré » de l'établissement par l'armée israélienne.",
            contentSnippet: "La Turquie a condamné « fermement la destruction par Israël de l'Hôpital de l'amitié turco-palestinienne », dénonçant un « ciblage délibéré » de l'établissement par l'armée israélienne.",
            guid: "https://www.lemonde.fr/guerre-au-proche-orient/live/2025/03/21/en-direct-guerre-a-gaza-l-armee-israelienne-dit-avoir-frappe-des-terroristes-dans-un-hopital-desaffecte_6582862_6325529.html",
            isoDate: "2025-03-21T21:20:47.000Z"
          }
        ]
      },
      {
        feed_id: 2,
        category_id: 1, // Politique
        title: "Franceinfo- Monde",
        items: [
          {
            title: "Fermeture de l'aéroport de Londres-Heathrow : ce que l'on sait de l'incident qui perturbe le trafic aérien mondial",
            link: "https://www.francetvinfo.fr/monde/royaume-uni/fermeture-de-l-aeroport-de-londres-heathrow-ce-que-le-l-on-sait-de-l-incident-qui-perturbe-le-trafic-aerien-mondial_7143177.html",
            pubDate: "Fri, 21 Mar 2025 22:30:46 +0100",
            enclosure: {
              length: "243",
              type: "image/jpeg",
              url: "https://www.francetvinfo.fr/pictures/obl1GX49KM27W7H5WmTRHwJ5W3Y/0x18:1024x594/432x243/filters:format(jpg)/2025/03/21/000-37dv6mx-67dd4a62952c0165602171.jpg"
            },
            content: "Le plus grand aéroport d'Europe a été contraint de fermer vendredi, à cause d'une panne de courant électrique provoquée par un incendie. La police antiterroriste britannique a annoncé mener une enquête.",
            contentSnippet: "Le plus grand aéroport d'Europe a été contraint de fermer vendredi, à cause d'une panne de courant électrique provoquée par un incendie. La police antiterroriste britannique a annoncé mener une enquête.",
            guid: "https://www.francetvinfo.fr/monde/royaume-uni/fermeture-de-l-aeroport-de-londres-heathrow-ce-que-le-l-on-sait-de-l-incident-qui-perturbe-le-trafic-aerien-mondial_7143177.html",
            isoDate: "2025-03-21T21:30:46.000Z"
          }
        ]
      }
    ];
    
    this.newsFeeds = mockNewsFeeds;
    this.processNewsFeeds();
    this.isLoading = false;
  }
}