import { Component, OnInit, inject } from '@angular/core';
import { ArticleService } from './../../../core/services/article/article.service';
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
  private articleService = inject(ArticleService);
  
  articles: Article[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  ngOnInit(): void {
    this.loadArticles();
  }
  
  loadArticles(): void {
    this.isLoading = true;
    this.articleService.getLatestArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Impossible de charger les actualités. Veuillez réessayer plus tard.';
        this.isLoading = false;
        console.error('Erreur de chargement des actualités:', error);
      }
    });
  }
  
  getTagClass(title: string): string {
    // Classification basée sur le titre, vous pouvez ajuster selon vos besoins
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('breaking') || lowerTitle.includes('attaque')) {
      return 'bg-red-100 text-red-800';
    } else if (lowerTitle.includes('analysis') || lowerTitle.includes('analyse')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerTitle.includes('report') || lowerTitle.includes('rapport')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  }
  
  getTag(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('breaking') || lowerTitle.includes('attaque')) {
      return 'BREAKING';
    } else if (lowerTitle.includes('analysis') || lowerTitle.includes('analyse')) {
      return 'ANALYSE';
    } else if (lowerTitle.includes('report') || lowerTitle.includes('rapport')) {
      return 'RAPPORT';
    } else {
      return 'ACTUALITÉ';
    }
  }
  
  getIconPath(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('breaking') || lowerTitle.includes('attaque')) {
      return 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z';
    } else if (lowerTitle.includes('analysis') || lowerTitle.includes('analyse')) {
      return 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9';
    } else if (lowerTitle.includes('report') || lowerTitle.includes('rapport')) {
      return 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z';
    } else {
      return 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z';
    }
  }
  
  getTimeAgo(dateString: string): string {
    const publishedDate = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} heure${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} jour${days > 1 ? 's' : ''} ago`;
    }
  }
}