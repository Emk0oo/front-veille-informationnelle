import { Component, ElementRef, HostListener, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  
  isScrolled = false;
  isMobileMenuOpen = false;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Vérifie si le code s'exécute dans un navigateur
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Vérifier la position initiale au chargement, seulement côté client
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    // Ne s'exécute que côté client
    if (this.isBrowser) {
      // Changer l'état lorsque le scroll dépasse 50px
      this.isScrolled = window.scrollY > 50;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Empêcher le défilement du body quand le menu est ouvert, seulement côté client
    if (this.isBrowser) {
      if (this.isMobileMenuOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }

  scrollToElement(elementId: string): void {
    // Ne s'exécute que côté client
    if (this.isBrowser) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Fermer le menu mobile après avoir cliqué sur un lien
      if (this.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
    }
  }
}