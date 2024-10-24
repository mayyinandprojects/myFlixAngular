import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

/**
 * Main application component for managing user interactions.
 *
 * @class AppComponent
 */
export class AppComponent {
  title = 'myFlix Angular'; // Title of the application

  /**
   * Creates an instance of the AppComponent.
   *
   * @param {Router} router - The Angular Router for navigation.
   * @param {AuthService} authService - The authentication service to manage user sessions.
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Checks if the user is logged in by calling the AuthService.
   *
   * @returns {boolean} True if the user is logged in; otherwise, false.
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Navigates to the movies page.
   */
  goToMovies(): void {
    this.router.navigate(['/movies']);
  }

  /**
   * Navigates to the user profile page.
   */
  goToProfile(): void {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage
    this.router.navigate([`/profile/${userId}`]);
  }

  /**
   * Logs out the user and navigates to the welcome page.
   */
  logout(): void {
    this.authService.logout(); // Use the AuthService to log out
    this.router.navigate(['/welcome']);
  }
}
