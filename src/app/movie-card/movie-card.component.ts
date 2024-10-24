// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component to display a list of movies as cards, allowing users to mark movies as favorites.
 * 
 * @class MovieCardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  /** Array to hold all movies fetched from the API. */
  movies: any[] = [];

  /** Array to store the IDs of the user's favorite movies. */
  favoriteMovies: string[] = [];

  /** User ID retrieved from local storage. */
  userId: string | null = localStorage.getItem('userId');

  /** Username of the logged-in user. */
  username: string | null = '';

  /**
   * Creates an instance of MovieCardComponent.
   * 
   * @param {FetchApiDataService} fetchApiData - Service to fetch movie data.
   * @param {MatSnackBar} snackBar - Service for displaying notifications.
   * @param {Router} router - Angular router for navigation.
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  /** Lifecycle hook that is called after the component has been initialized. */
  ngOnInit(): void {
    this.getMovies();         // Fetch all movies on initialization
    this.getUserFavorites();  // Fetch user's favorite movies
  }

  /**
   * Fetches all movies from the API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      this.movies = movies;  // Assign the fetched movies to the local array
    });
  }

  /**
   * Fetches the user's favorite movies and username based on user ID.
   */
  getUserFavorites(): void {
    if (this.userId) {
      this.fetchApiData.getUserById(this.userId).subscribe((user: any) => {
        if (user) {
          this.favoriteMovies = user.favorite_movies; // Store user's favorite movies
          this.username = user.username;               // Store the username from user details
        }
      });
    }
  }

  /**
   * Checks if a specific movie is a favorite.
   * 
   * @param {string} movieId - The ID of the movie to check.
   * @returns {boolean} - True if the movie is a favorite; otherwise, false.
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  /**
   * Toggles the favorite status of a movie.
   * 
   * @param {string} movieId - The ID of the movie to toggle.
   */
  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFromFavorites(movieId);  // Remove from favorites if already a favorite
    } else {
      this.addToFavorites(movieId);        // Add to favorites if not a favorite
    }
  }

  /**
   * Adds a movie to the user's favorites.
   * 
   * @param {string} movieId - The ID of the movie to add.
   */
  addToFavorites(movieId: string): void {
    if (this.username) {
      this.fetchApiData.addFavoriteMovie(this.username, movieId).subscribe(() => {
        this.favoriteMovies.push(movieId); // Update local favoriteMovies array
        this.snackBar.open('Added to favorites!', 'OK', { duration: 2000 });
      });
    }
  }

  /**
   * Removes a movie from the user's favorites.
   * 
   * @param {string} movieId - The ID of the movie to remove.
   */
  removeFromFavorites(movieId: string): void {
    if (this.username) {
      this.fetchApiData.removeFavoriteMovie(this.username, movieId).subscribe(() => {
        this.favoriteMovies = this.favoriteMovies.filter((id) => id !== movieId); // Remove from local array
        this.snackBar.open('Removed from favorites!', 'OK', { duration: 2000 });
      });
    }
  }

  /**
   * Navigates to the movie details page based on the movie title.
   * 
   * @param {string} movieTitle - The title of the movie to view details for.
   */
  goToMovieDetails(movieTitle: string): void {
    this.router.navigate([`/movie-details/${movieTitle}`]);
  }
}
