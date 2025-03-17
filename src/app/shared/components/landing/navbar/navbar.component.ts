import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  constructor() {}

  ngOnInit(): void {
    // Vérifier la position initiale au chargement
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    // Changer l'état lorsque le scroll dépasse 50px
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.mobileMenu.nativeElement.classList.remove('hidden');
    } else {
      this.mobileMenu.nativeElement.classList.add('hidden');
    }
  }

  scrollToElement(elementId: string): void {
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