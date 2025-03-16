import { Component, OnInit, inject } from '@angular/core';
import { NewsService } from './news.service';
import { Article } from '../../../core/models/article.model';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, RouterLink],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  
  Articles: Article[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  ngOnInit(): void {
    this.loadNews();
  }
  
  loadNews(): void {
    this.isLoading = true;
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.Articles = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Impossible de charger les actualités. Veuillez réessayer plus tard.';
        this.isLoading = false;
        console.error('Erreur de chargement des actualités:', error);
      }
    });
  }
  
  getTagClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'breaking':
        return 'bg-red-100 text-red-800';
      case 'analysis':
        return 'bg-blue-100 text-blue-800';
      case 'report':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getIconPath(type: string): string {
    switch (type.toLowerCase()) {
      case 'breaking':
        return 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z';
      case 'analysis':
        return 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9';
      case 'report':
        return 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z';
      default:
        return 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z';
    }
  }
}