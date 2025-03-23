import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleItem } from '../../../core/services/feedRss/feed-rss.service';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div class="h-48 bg-gray-100 relative overflow-hidden">
        <img *ngIf="getImageUrl()" [src]="getImageUrl()" [alt]="article.title" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
        <div *ngIf="!getImageUrl()" class="w-full h-full flex items-center justify-center bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <div class="absolute top-2 left-2">
          <span [ngClass]="getCategoryClass()" class="text-xs font-semibold px-2.5 py-0.5 rounded">
            {{ getCategoryName() }}
          </span>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <div class="flex items-center mb-2">
          <span class="text-xs text-gray-500">{{ getTimeAgo(article.isoDate || article.published_at) }}</span>
          <span class="mx-2 text-gray-300">•</span>
          <span class="text-xs text-gray-500">{{ sourceName }}</span>
        </div>
        <h3 class="text-lg font-semibold mb-2 hover:text-blue-600 line-clamp-2">
          <a [href]="article.link" target="_blank" title="{{ article.title }}">{{ article.title }}</a>
        </h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {{ article.contentSnippet }}
        </p>
        <a [href]="article.link" target="_blank" class="text-blue-600 hover:text-blue-700 inline-flex items-center text-sm font-medium mt-auto">
          Lire l'article complet
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .tag-politique {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    .tag-economie {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .tag-conflits {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    .tag-environnement {
      background-color: #fef3c7;
      color: #92400e;
    }
    
    .tag-technologie {
      background-color: #ede9fe;
      color: #5b21b6;
    }
    
    .tag-societe {
      background-color: #fce7f3;
      color: #9d174d;
    }
    
    .tag-default {
      background-color: #f3f4f6;
      color: #4b5563;
    }
  `]
})
export class ArticleCardComponent {
  @Input() article!: ArticleItem;
  @Input() sourceName: string = '';
  @Input() categoryId: number = 0;
  
  getImageUrl(): string {
    // Vérifier d'abord si l'article a une propriété imageUrl
    if (this.article.imageUrl) {
      return this.article.imageUrl;
    }
    
    // Sinon, essayer de récupérer l'URL de l'image depuis les autres propriétés possibles
    if (this.article.mediaContent && this.article.mediaContent.length > 0) {
      return this.article.mediaContent[0].$.url;
    } else if (this.article.enclosure && this.article.enclosure.url) {
      return this.article.enclosure.url;
    }
    
    return ''; // Pas d'image disponible
  }
  
  getCategoryName(): string {
    // Mapping des IDs de catégorie avec leurs noms
    const categories: Record<number, string> = {
      1: 'Politique',
      2: 'Économie',
      3: 'Conflits',
      4: 'Environnement',
      5: 'Technologie',
      6: 'Société'
    };
    
    return categories[this.categoryId] || 'Actualité';
  }
  
  getCategoryClass(): string {
    // Mapping des IDs de catégorie avec leurs classes CSS
    const classes: Record<number, string> = {
      1: 'tag-politique',
      2: 'tag-economie',
      3: 'tag-conflits',
      4: 'tag-environnement',
      5: 'tag-technologie',
      6: 'tag-societe'
    };
    
    return classes[this.categoryId] || 'tag-default';
  }
  
  getTimeAgo(dateString: string | undefined): string {
    if (!dateString) {
      return 'Date inconnue';
    }
    
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