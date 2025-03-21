import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Interface pour les données d'article
export interface ArticleItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
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

// Interface pour le flux d'actualités
export interface NewsFeed {
  feed_id: number;
  category_id: number;
  title: string;
  items: ArticleItem[];
}

@Injectable({
  providedIn: 'root'
})
export class FeedRssService {
  private apiUrl = `${environment.apiUrl}/feeds`;
  
  constructor(private http: HttpClient) {}
  
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
  
  // Récupérer les flux d'actualités pour une date spécifique
  getFeedsByDate(date: string): Observable<NewsFeed[]> {
    return this.http.get<NewsFeed[]>(`${this.apiUrl}/by-date/${date}`)
      .pipe(
        catchError(error => {
          console.error(`Erreur lors de la récupération des flux d'actualités pour la date ${date}:`, error);
          return throwError(() => new Error(`Échec de récupération des flux d'actualités pour la date ${date}`));
        })
      );
  }
  
  // Récupérer les flux d'actualités par catégorie
  getFeedsByCategory(categoryId: number): Observable<NewsFeed[]> {
    return this.http.get<NewsFeed[]>(`${this.apiUrl}/by-category/${categoryId}`)
      .pipe(
        catchError(error => {
          console.error(`Erreur lors de la récupération des flux d'actualités pour la catégorie ${categoryId}:`, error);
          return throwError(() => new Error(`Échec de récupération des flux d'actualités pour la catégorie ${categoryId}`));
        })
      );
  }
  
  // Récupérer les flux d'actualités par source
  getFeedsBySource(feedId: number): Observable<NewsFeed[]> {
    return this.http.get<NewsFeed[]>(`${this.apiUrl}/by-source/${feedId}`)
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



