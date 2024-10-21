import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = []; // Store user's favorite movies
  userId: string | null = localStorage.getItem('userId'); // Get the user ID from localStorage
  username: string | null = ''; // Store the username

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUserFavorites();
  }

  // Fetch all movies
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      this.movies = movies;
    });
  }

  // Fetch user's favorite movies and username
  getUserFavorites(): void {
    if (this.userId) {
      this.fetchApiData.getUserById(this.userId).subscribe((user: any) => {
        if (user) {
          this.favoriteMovies = user.favorite_movies; // Store user's favorite movies
          this.username = user.username; // Store the username from the user details
        }
      });
    }
  }

  // Check if a movie is a favorite
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  // Toggle favorite status
  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      // Remove from favorites
      this.removeFromFavorites(movieId);
    } else {
      // Add to favorites
      this.addToFavorites(movieId);
    }
  }

  // Add a movie to favorites
  addToFavorites(movieId: string): void {
    if (this.username) {
      // Make sure the username is available
      this.fetchApiData
        .addFavoriteMovie(this.username, movieId)
        .subscribe(() => {
          this.favoriteMovies.push(movieId); // Update local favoriteMovies array
          this.snackBar.open('Added to favorites!', 'OK', { duration: 2000 });
        });
    }
  }

  // Remove a movie from favorites
  removeFromFavorites(movieId: string): void {
    if (this.username) {
      // Make sure the username is available
      this.fetchApiData
        .removeFavoriteMovie(this.username, movieId)
        .subscribe(() => {
          this.favoriteMovies = this.favoriteMovies.filter(
            (id) => id !== movieId
          ); // Remove from local array
          this.snackBar.open('Removed from favorites!', 'OK', {
            duration: 2000,
          });
        });
    }
  }

  goToMovieDetails(movieTitle: string): void {
    this.router.navigate([`/movie-details/${movieTitle}`]);
  }
}
