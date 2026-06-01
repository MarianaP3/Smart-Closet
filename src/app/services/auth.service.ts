import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private readonly userRoutePrefixes = [
    'inventory',
    'new-garment',
    'outfits',
    'new-outfit',
    'armarios',
    'new-armario',
  ];

  private readonly adminRoutePrefixes = [
    'categorias',
    'new-categoria',
    'usuarios',
  ];

  private readonly publicRoutePrefixes = [
    'home',
    'login',
    'register',
    'not-found',
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('cart');
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    const role = this.getRoleFromToken();
    return role === 'Administrador' || role === 'admin';
  }

  isUser(): boolean {
    const role = this.getRoleFromToken();
    return role === 'Usuario' || role === 'user';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasUserAreaAccess(): boolean {
    return this.isLoggedIn() && (this.isUser() || this.isAdmin());
  }

  canAccessRoute(path: string): boolean {
    const segment = path.split('?')[0].split('/').filter(Boolean)[0] ?? 'home';

    if (this.publicRoutePrefixes.includes(segment)) {
      return true;
    }

    if (!this.isLoggedIn()) {
      return false;
    }

    if (this.isAdmin()) {
      return true;
    }

    if (this.isUser()) {
      return this.userRoutePrefixes.includes(segment);
    }

    return false;
  }

  redirectIfUnauthorized(path?: string): void {
    const routePath = path ?? this.router.url;

    if (this.canAccessRoute(routePath)) {
      return;
    }

    const segment =
      routePath.split('?')[0].split('/').filter(Boolean)[0] ?? 'home';

    if (
      !this.isLoggedIn() &&
      !this.publicRoutePrefixes.includes(segment)
    ) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/not-found']);
  }

  redirectIfNotUserArea(): void {
    if (this.hasUserAreaAccess()) {
      return;
    }

    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/not-found']);
  }

  redirectIfNotAdmin(): void {
    if (!this.isAdmin()) {
      this.router.navigate(['/not-found']);
    }
  }
}
