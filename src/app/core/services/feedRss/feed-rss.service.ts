import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';

// Interface pour les articles retournés par l'API (nouveau format)
export interface Article {
  id: number;
  feed_id: number;
  category_id: number | null;
  title: string;
  link: string;
  content: string;
  content_snippet: string;
  guid: string;
  iso_date: string;
  image_url: string;
  published_at: string;
}

// Interface pour l'ancien format d'article (pour la compatibilité si nécessaire)
export interface ArticleItem {
  title: string;
  link: string;
  pubDate?: string;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
  published_at?: string;
  imageUrl?: string;
  mediaContent?: Array<{
    $: {
      url: string;
      width: string;
      height: string;
    };
    'media:description'?: Array<{
      _: string;
      $: {
        type: string;
      };
    }>;
    'media:credit'?: Array<{
      _: string;
      $: {
        scheme: string;
      };
    }>;
  }>;
  enclosure?: {
    url: string;
    type: string;
    length: string;
  };
}

// Interface pour le flux d'actualités (ancien format)
export interface NewsFeed {
  feed_id: number;
  category_id: number;
  title: string;
  items: ArticleItem[];
}

// Interface pour les métadonnées des sources
export interface FeedSource {
  id: number;
  title: string;
  url: string;
  category_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedRssService {
  private apiUrl = `${environment.apiUrl}/rssFeeds`;
  private feedSources: FeedSource[] = [];
  
  constructor(private http: HttpClient, private authService: AuthService) {
    // Précharger les sources au démarrage
    this.loadFeedSources();
  }
  
  // Charger les métadonnées des sources
  private loadFeedSources(): void {
    this.http.get<FeedSource[]>(`${this.apiUrl}/sources`)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des sources:', error);
          return throwError(() => new Error('Échec du chargement des sources'));
        })
      )
      .subscribe(sources => {
        this.feedSources = sources;
      });
  }
  
  // Récupérer le nom d'une source par son ID
  getSourceNameById(feedId: number): string {
    const source = this.feedSources.find(s => s.id === feedId);
    return source ? source.title : `Source ${feedId}`;
  }
  
  // Récupérer tous les flux d'actualités
  getAllFeeds(): Observable<NewsFeed[]> {
    return this.http.get<NewsFeed[]>(`${this.apiUrl}`)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des flux d\'actualités:', error);
          return throwError(() => new Error('Échec de récupération des flux d\'actualités'));
        })
      );
  }

  // Récupérer tous les articles pour un utilisateur authentifié
  getAllSubscribedArticles(): Observable<Article[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token non disponible'));
    }

    // Décodage du token pour extraire l'ID utilisateur
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const user = JSON.parse(decodedPayload);
    const userId = user.id;
    const headers = { 'Authorization': `Bearer ${token}` };
    
    return this.http.get<Article[]>(`${this.apiUrl}/user/${userId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des articles abonnés:', error);
          return throwError(() => new Error('Échec de récupération des articles abonnés'));
        })
      );
  }
  
  // Récupérer les articles par date pour un utilisateur authentifié
  getAllSubscribedArticlesByDate(date: string): Observable<Article[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token non disponible'));
    }

    // Décodage du token pour extraire l'ID utilisateur
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const user = JSON.parse(decodedPayload);
    const userId = user.id;
    const headers = { 'Authorization': `Bearer ${token}` };

    return this.http.get<Article[]>(`${this.apiUrl}/user/${userId}/articles/${date}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des articles abonnés par date:', error);
          return throwError(() => new Error('Échec de récupération des articles abonnés par date'));
        })
      );
  }
  
  // Récupérer les flux d'actualités par catégorie
  getFeedsByCategory(categoryId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/by-category/${categoryId}`)
      .pipe(
        catchError(error => {
          console.error(`Erreur lors de la récupération des flux d'actualités pour la catégorie ${categoryId}:`, error);
          return throwError(() => new Error(`Échec de récupération des flux d'actualités pour la catégorie ${categoryId}`));
        })
      );
  }
  
  // Récupérer les flux d'actualités par source
  getFeedsBySource(feedId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/by-source/${feedId}`)
      .pipe(
        catchError(error => {
          console.error(`Erreur lors de la récupération des flux d'actualités pour la source ${feedId}:`, error);
          return throwError(() => new Error(`Échec de récupération des flux d'actualités pour la source ${feedId}`));
        })
      );
  }
  
  // Obtenir le nombre d'articles pour les statistiques
  getArticlesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/count`)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du comptage des articles:', error);
          return throwError(() => new Error('Échec du comptage des articles'));
        })
      );
  }
}