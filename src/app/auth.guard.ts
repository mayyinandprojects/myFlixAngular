// src/app/auth.guard.ts
//To further improve the user experience, route guards are used to prevent unauthorized users from accessing certain routes like /movies or /profile if they are not logged in (see app-routing.module.ts)

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/welcome']); // Redirect to login page if not logged in
      return false;
    }
  }
}
