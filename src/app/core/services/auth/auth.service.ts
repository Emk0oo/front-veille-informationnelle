// core/services/auth/auth.service.ts
import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';

// Interface adaptée à la réponse de votre API
interface LoginResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'authToken';
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => this.setSession(response)),
        catchError(error => {
          console.error('Erreur de connexion:', error);
          return throwError(() => new Error('Identifiants invalides'));
        })
      );
  }
  
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
    this.router.navigate(['/']);
  }
  
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }
  
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }
  
  private setSession(authResult: LoginResponse): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.tokenKey, authResult.token);
  }
}