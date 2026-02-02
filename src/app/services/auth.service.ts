import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
export interface StudentAuthUser {
  id: number;
  name: string;
  email: string;
  email_verified?: boolean;
}

export interface StudentAuthResponse {
  access_token: string;
  user: StudentAuthUser;
}

export interface StoredAuthData {
  access_token: string;
  user: StudentAuthUser;
  rememberMe: boolean;
  timestamp: number;
}

  
  

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData = signal<StoredAuthData | null>(null);
  private readonly TOKEN_KEY = 'coaching_auth';
  private readonly TOKEN_EXPIRY_DAYS = 7;

  // Public signals
  currentUser = computed(() => this.authData()?.user || null);
  isLoggedIn = computed(() => !!this.authData()?.access_token);
  token = computed(() => this.authData()?.access_token || null);

  constructor(private router: Router) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const storedData = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    if (storedData) {
      try {
        const data: StoredAuthData = JSON.parse(storedData);
        // Check if token is still valid (7 days)
        const ageInDays = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
        if (ageInDays < this.TOKEN_EXPIRY_DAYS) {
          this.authData.set(data);
        } else {
          this.clearStorage();
        }
      } catch (error) {
        this.clearStorage();
      }
    }
  }

  login(response: StudentAuthResponse, rememberMe: boolean): void {
    const authData: StoredAuthData = {
      ...response,
      rememberMe,
      timestamp: Date.now()
    };
    
    this.authData.set(authData);
    
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(authData));
      sessionStorage.removeItem(this.TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(authData));
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  register(response: StudentAuthResponse, rememberMe: boolean): void {
    this.login(response, rememberMe);
  }
  
  logout(): void {
    this.authData.set(null);
    this.clearStorage();
    this.router.navigate(['/']);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  getUser(): StudentAuthUser | null {
    return this.currentUser();
  }
  
  getToken(): string | null {
    return this.token();
  }

  updateUser(user: Partial<StudentAuthUser>): void {
    const currentData = this.authData();
    if (currentData) {
      const updatedUser = { ...currentData.user, ...user };
      const updatedData: StoredAuthData = {
        ...currentData,
        user: updatedUser
      };
      this.authData.set(updatedData);
      
      const storage = currentData.rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.TOKEN_KEY, JSON.stringify(updatedData));
    }
  }

  setEmailVerified(): void {

    const current = this.authData();
  
    if (!current) return;
  
    const updated: StoredAuthData = {
      ...current,
      user: {
        ...current.user,
        email_verified: true
      }
    };
  
    this.authData.set(updated);
  
    const storage = current.rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, JSON.stringify(updated));
  }
  
}