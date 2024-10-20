// src/app/app.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';  // Import your authentication service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title="myFlix Angular"

  constructor(private router: Router, private authService: AuthService) {}

  // Check if user is logged in by calling AuthService
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Navigate to movies
  goToMovies(): void {
    this.router.navigate(['/movies']);
  }

  // Navigate to user profile
  goToProfile(): void {
    const userId = localStorage.getItem('userId');
    this.router.navigate([`/profile/${userId}`]);
  }

  // Logout logic
  logout(): void {
    this.authService.logout(); // Use the AuthService to logout
    this.router.navigate(['/welcome']);
  }
}
