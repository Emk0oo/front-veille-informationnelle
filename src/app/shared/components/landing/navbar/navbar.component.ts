import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;
  @ViewChild('menuToggle') menuToggle!: ElementRef;

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

  // Méthode séparée pour toggler le menu
  toggleMobileMenu(): void {
    if (this.mobileMenu) {
      this.mobileMenu.nativeElement.classList.toggle('hidden');
    }
  }
}