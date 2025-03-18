import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NewsComponent } from '../../shared/components/landing/news/news.component';
import { NavbarComponent } from '../../shared/components/landing/navbar/navbar.component';
import { HeroComponent } from '../../shared/components/landing/hero/hero.component';
import { FeaturesComponent } from "../../shared/components/landing/features/features.component";
import { StatisticsComponent } from '../../shared/components/landing/statistics/statistics.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  imports: [CommonModule, NewsComponent, NavbarComponent, HeroComponent, FeaturesComponent, StatisticsComponent],
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit {
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initializeChartBars();
    }
  }

  // Animation des barres du graphique
  private initializeChartBars(): void {
    if (!this.isBrowser) return;
    
    const bars = document.querySelectorAll('.chart-bar');
    
    bars.forEach(bar => {
      const height = (bar as HTMLElement).style.height;
      (bar as HTMLElement).style.height = '0';
      
      setTimeout(() => {
        (bar as HTMLElement).style.height = height;
      }, 300);
    });
  }

  // Méthode pour le smooth scroll
  scrollToElement(elementId: string): void {
    if (!this.isBrowser) return;
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }
}