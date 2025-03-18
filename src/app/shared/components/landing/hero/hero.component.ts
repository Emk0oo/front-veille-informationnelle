// shared/components/landing/hero.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  private dotsInterval: any;
  private pulseInterval: any;
  private dots: HTMLElement[] = [];
  private radarCenter = { x: 0, y: 0 };
  private currentPulseRadius = 0;
  private pulseMaxRadius = 1000;
  private pulseStep = 5;
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Initialisation du radar après le chargement du composant, uniquement côté client
    if (this.isBrowser) {
      setTimeout(() => {
        if (this.isBrowser) {  // Vérifier à nouveau en cas de changement d'état
          this.initializeRadar();
        }
      }, 200);
    }
  }

  ngOnDestroy(): void {
    // Nettoyage des intervalles lors de la destruction du composant
    if (this.isBrowser) {
      if (this.dotsInterval) {
        clearInterval(this.dotsInterval);
      }
      if (this.pulseInterval) {
        clearInterval(this.pulseInterval);
      }
    }
  }

  scrollToElement(elementId: string): void {
    if (!this.isBrowser) return;
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private initializeRadar(): void {
    if (!this.isBrowser) return;
    
    const container = document.querySelector('.sonar-container') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    this.radarCenter = {
      x: containerRect.left + containerRect.width / 2,
      y: containerRect.top + containerRect.height / 2
    };
    
    // Créer des points aléatoires
    this.createRandomDots(30);
    
    // Repositionner les points toutes les 5 secondes
    this.dotsInterval = setInterval(() => {
      if (this.isBrowser) {  // Vérifier à nouveau en cas de changement d'état
        this.repositionDots();
      }
    }, 5000);
    
    // Simuler l'effet de radar qui détecte les points
    this.pulseInterval = setInterval(() => {
      if (this.isBrowser) {  // Vérifier à nouveau en cas de changement d'état
        this.checkRadarCollisions();
        this.currentPulseRadius = (this.currentPulseRadius + this.pulseStep) % this.pulseMaxRadius;
      }
    }, 50);
  }

  private createRandomDots(count: number): void {
    if (!this.isBrowser) return;
    
    const dotsContainer = document.getElementById('radar-dots');
    if (!dotsContainer) return;
    
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'radar-dot';
      
      // Position aléatoire sur l'écran
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      
      dotsContainer.appendChild(dot);
      this.dots.push(dot);
    }
  }

  private repositionDots(): void {
    if (!this.isBrowser) return;
    
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    this.dots.forEach(dot => {
      // Nouvelle position aléatoire
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      
      // Transition douce vers la nouvelle position
      dot.style.transition = 'top 2s ease, left 2s ease';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      
      // Retirer la classe active
      dot.classList.remove('active');
    });
  }

  private checkRadarCollisions(): void {
    if (!this.isBrowser) return;
    
    this.dots.forEach(dot => {
      const dotRect = dot.getBoundingClientRect();
      const dotCenter = {
        x: dotRect.left + dotRect.width / 2,
        y: dotRect.top + dotRect.height / 2
      };
      
      // Calculer la distance entre le centre du radar et le point
      const distance = Math.sqrt(
        Math.pow(dotCenter.x - this.radarCenter.x, 2) + 
        Math.pow(dotCenter.y - this.radarCenter.y, 2)
      );
      
      // Vérifier si le point est à la distance du pulse actuel (avec une marge)
      const margin = 10;
      if (Math.abs(distance - this.currentPulseRadius) < margin) {
        dot.classList.add('active');
        
        // Enlever la classe active après l'animation
        setTimeout(() => {
          if (this.isBrowser) {  // Vérifier à nouveau en cas de changement d'état
            dot.classList.remove('active');
          }
        }, 1000);
      }
    });
  }
}