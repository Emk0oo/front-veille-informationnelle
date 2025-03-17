import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NewsComponent } from '../../shared/components/landing/news/news.component';
import { NavbarComponent } from '../../shared/components/landing/navbar/navbar.component';
import { HeroComponent } from '../../shared/components/landing/hero/hero.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  imports: [NewsComponent, NavbarComponent, HeroComponent],
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit {
  
  constructor() {}

  ngAfterViewInit() {
    this.initializeChartBars();
  }

  // Animation des barres du graphique
  private initializeChartBars(): void {
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