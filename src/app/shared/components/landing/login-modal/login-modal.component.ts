import { Component, Output, EventEmitter, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  private router = inject(Router);
  private http = inject(HttpClient);
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  login(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.http.post<{message: string, token: string}>(`${environment.apiUrl}/auth/login`, { email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          // Stocker le token
          if (this.isBrowser) {
            localStorage.setItem('authToken', response.token);
          }
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
  }
  
  onClose(): void {
    this.closeModal.emit();
  }
}