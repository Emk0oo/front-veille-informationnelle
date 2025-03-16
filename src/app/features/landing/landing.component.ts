import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NewsComponent } from '../../shared/components/landing/news.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  imports: [NewsComponent],
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  
  constructor() {}

  ngAfterViewInit() {
    // Vérifier si les éléments existent avant d'initialiser
    if (this.mobileMenu && this.menuToggle) {
      this.initializeMobileMenu();
    }
    
    this.initializeChartBars();
    this.initializeSmoothScroll();
  }

  // Gestion du menu mobile
  private initializeMobileMenu(): void {
    if (this.menuToggle && this.mobileMenu) {
      this.menuToggle.nativeElement.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }
  }

  // Méthode séparée pour toggler le menu
  toggleMobileMenu(): void {
    if (this.mobileMenu) {
      this.mobileMenu.nativeElement.classList.toggle('hidden');
    }
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

  // Smooth scroll
  private initializeSmoothScroll(): void {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        
        const targetId = (link as HTMLAnchorElement).getAttribute('href');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
          
          // Fermer le menu mobile si ouvert
          this.toggleMobileMenu();
        }
      });
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
      
      // Fermer le menu mobile si ouvert
      this.toggleMobileMenu();
    }
  }
}