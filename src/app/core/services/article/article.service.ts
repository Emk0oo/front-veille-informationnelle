import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Article } from '../../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:3000/api/rssFeeds/last3';
  
  constructor(private http: HttpClient) {}
  
  getLatestArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Erreur de récupération des articles:', error);
          return throwError(() => new Error('Échec de récupération des derniers articles'));
        })
      );
  }
}