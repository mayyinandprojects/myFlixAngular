// src/app/auth.guard.ts
//To further improve the user experience, route guards are used to prevent unauthorized users from accessing certain routes like /movies or /profile if they are not logged in (see app-routing.module.ts)

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard to ensure that a user is properly logged in before accessing certain routes.
 * Implements `CanActivate` interface from Angular.
 * 
 * @class AuthGuard
 * @implements {CanActivate}
 * 
 * @param {AuthService} authService - Service to check if the user is authenticated.
 * @param {Router} router - Angular Router used to navigate to the login page if user is not authenticated.
 */
export class AuthGuard implements CanActivate {
  /**
   * Creates an instance of `AuthGuard`.
   * 
   * @param {AuthService} authService - The authentication service to check if the user is logged in.
   * @param {Router} router - The Angular router to redirect unauthenticated users.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines if a route can be activated (if the user is logged in).
   * 
   * @returns {boolean} True if the user is logged in, false otherwise.
   */
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/welcome']); // Redirect to login page if not logged in
      return false;
    }
  }
}

