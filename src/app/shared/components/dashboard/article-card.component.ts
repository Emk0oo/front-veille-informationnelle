import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface pour les données d'article provenant de l'API
export interface ArticleItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
  // Propriétés optionnelles pour gérer les différentes structures possibles
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

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent {
  @Input() article!: ArticleItem;
  @Input() sourceName: string = '';
  @Input() categoryId: number = 0;
  
  // Récupérer l'URL de l'image selon la structure disponible
  getImageUrl(): string {
    if (this.article.mediaContent && this.article.mediaContent.length > 0) {
      return this.article.mediaContent[0].$.url;
    } else if (this.article.enclosure && this.article.enclosure.url) {
      return this.article.enclosure.url;
    }
    return '/api/placeholder/500/280'; // Image par défaut
  }
  
  // Obtenir la catégorie en fonction du categoryId
  getCategoryName(): string {
    // Mapping simple des IDs aux noms de catégories (à enrichir selon vos besoins)
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
  
  // Obtenir la classe CSS pour le tag de catégorie
  getCategoryClass(): string {
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
  
  // Formater la date relative
  getTimeAgo(isoDate: string): string {
    const publishedDate = new Date(isoDate);
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