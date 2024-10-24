// src/app/auth.service.ts
// service to handle login and authentication status tracking (to handle of navbar appears or not, etc.)
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for authenticating user login with bearer token.
 * Provides methods to check login status and log out.
 * 
 * @class AuthService
 */
export class AuthService {
  constructor() {}

  /**
   * Checks if the user is logged in by verifying if a token exists in local storage.
   * 
   * @returns {boolean} True if the token exists, otherwise false.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Returns true if token exists
  }

  /**
   * Logs out the user by removing the token from local storage.
   * This effectively ends the user's session.
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}

