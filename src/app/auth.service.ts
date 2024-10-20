// src/app/auth.service.ts
// service to handle login and authentication status tracking (to handle of navbar appears or not, etc.)
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // Check if user is logged in by verifying token
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Returns true if token exists
  }

  // Log out the user
  logout(): void {
    localStorage.removeItem('token');
  }
}
