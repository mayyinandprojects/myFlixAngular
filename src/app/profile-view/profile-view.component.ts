// src/app/profile-view/profile-view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To capture route params
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; // For navigation
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Import dialog

/**
 * Component to display and edit user profile information.
 * 
 * @class ProfileViewComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
  /** User information retrieved from the API. */
  userInfo: any = {};
  
  /** User information for editing. */
  updatedUserInfo: any = {};
  
  /** Indicates if the user is currently editing their profile. */
  isEditing = false;
  
  /** ID of the user being viewed/edited. */
  userId: string | null = null;
  
  /** List of user's favorite movies. */
  favoriteMovies: any[] = [];

  /**
   * Creates an instance of ProfileViewComponent.
   * 
   * @param {FetchApiDataService} fetchApiData - Service to fetch user and movie data.
   * @param {Router} router - Service for navigation.
   * @param {MatSnackBar} snackBar - Service for displaying notifications.
   * @param {MatDialog} dialog - Service for opening dialog windows.
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  /** Lifecycle hook that is called after data-bound properties are initialized. */
  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getUserInfo(userId);
    }
  }

  /**
   * Fetches user information by user ID.
   * 
   * @param {string} userId - ID of the user to fetch information for.
   */
  getUserInfo(userId: string): void {
    this.fetchApiData.getUserById(userId).subscribe((user: any) => {
      this.userInfo = user;

      // Format the date for ngModel in YYYY-MM-DD format
      this.updatedUserInfo = {
        ...this.userInfo,
        birthday: this.formatDateForInput(this.userInfo.birthday),
      };

      console.log(this.userInfo); // To check the fetched user data

      // Fetch favorite movies based on the IDs in userInfo.favorite_movies
      this.getAllMoviesAndFavorites(user.favorite_movies);
    });
  }

  /**
   * Retrieves all movies and populates the user's favorite movies list.
   * 
   * @param {string[]} movieIds - Array of favorite movie IDs.
   */
  getAllMoviesAndFavorites(movieIds: string[]): void {
    this.favoriteMovies = []; // Reset favorite movies

    // First, fetch all movies
    this.fetchApiData.getAllMovies().subscribe(
      (allMovies: any[]) => {
        // Map the movie IDs to their corresponding movies
        movieIds.forEach((id) => {
          const matchedMovie = allMovies.find((movie) => movie._id === id);
          if (matchedMovie) {
            this.favoriteMovies.push(matchedMovie); // Add the matched movie to favorites
            console.log('Matched favorite movie:', matchedMovie);
          } else {
            console.error('No movie found for ID:', id);
          }
        });
      },
      (error) => {
        console.error('Error fetching all movies:', error);
      }
    );
  }

  /**
   * Helper method to format the date for the date input field.
   * 
   * @param {string} date - The date string to format.
   * @returns {string} The formatted date string in YYYY-MM-DD format.
   */
  formatDateForInput(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    return parsedDate.toISOString().substring(0, 10); // YYYY-MM-DD format for input[type="date"]
  }

  /**
   * Saves the updated profile information.
   * 
   * This function sends updated user info to the backend and updates the local state.
   */
  saveProfile(): void {
    if (this.userInfo && this.userInfo.username) {
      this.fetchApiData
        .editUser(this.userInfo.username, this.updatedUserInfo)
        .subscribe(
          (response: any) => {
            this.snackBar.open('Profile updated successfully', 'OK', {
              duration: 2000,
            });
            // Update displayed user info after successful update
            this.userInfo = { ...this.updatedUserInfo };
            this.isEditing = false; // Exit edit mode
          },
          (error) => {
            this.snackBar.open('Error updating profile', 'OK', {
              duration: 2000,
            });
          }
        );
    }
  }

  /**
   * Toggles edit mode for the profile.
   * If exiting edit mode, resets the updated user info.
   */
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updatedUserInfo = { ...this.userInfo }; // Reset the form if the user cancels editing
    }
  }

  /**
   * Checks if a movie is in the user's favorite movies list.
   * 
   * @param {any} movie - The movie object to check.
   * @returns {boolean} True if the movie is a favorite, otherwise false.
   */
  isFavorite(movie: any): boolean {
    return this.userInfo.favorite_movies.includes(movie._id);
  }

  /**
   * Toggles the favorite status of a movie.
   * 
   * @param {any} movie - The movie object to toggle.
   */
  toggleFavorite(movie: any): void {
    const isFav = this.isFavorite(movie);

    // Ensure username is available
    if (!this.userInfo.username) {
      console.error('Username not available');
      return;
    }

    // Call the API to add/remove from favorites
    if (isFav) {
      // If it's already a favorite, remove it
      this.fetchApiData
        .removeFavoriteMovie(this.userInfo.username, movie._id)
        .subscribe(
          (response: any) => {
            console.log(`${movie.title} removed from favorites`);
            // Update local state by removing the movie ID
            this.userInfo.favorite_movies =
              this.userInfo.favorite_movies.filter(
                (id: string) => id !== movie._id
              );
            // Update the favoriteMovies array
            this.favoriteMovies = this.favoriteMovies.filter(
              (favMovie) => favMovie._id !== movie._id
            );
          },
          (error) => {
            console.error('Error removing favorite movie:', error);
          }
        );
    } else {
      // If it's not a favorite, add it
      this.fetchApiData
        .addFavoriteMovie(this.userInfo.username, movie._id)
        .subscribe(
          (response: any) => {
            console.log(`${movie.title} added to favorites`);
            // Add the movie ID to the local favorite_movies array
            this.userInfo.favorite_movies.push(movie._id);
            // Add the movie to the favoriteMovies array
            this.favoriteMovies.push(movie);
          },
          (error) => {
            console.error('Error adding favorite movie:', error);
          }
        );
    }
  }

  /**
   * Opens a confirmation dialog to delete the user account.
   * If confirmed, deletes the user account and logs out.
   */
  deleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log('User confirmed deletion. Proceeding to delete account.');
        this.fetchApiData.deleteUser(this.userInfo.username).subscribe(
          (response: any) => {
            // Log the entire response for debugging purposes
            console.log('API response:', response);

            // Check if the response contains meaningful data
            if (response && Object.keys(response).length > 0) {
              console.log('Account deleted successfully:', response);
            } else {
              console.log(
                'Response is empty, but status 200. Proceeding with logout.'
              );
            }

            this.snackBar.open('Account deleted successfully', 'OK', {
              duration: 2000,
            });

            // After account is deleted, log out and redirect to welcome/login page
            setTimeout(() => {
              this.logoutAndRedirect();
            }, 1000); // 1-second delay before redirecting
          },
          (error) => {
            console.error('Error deleting account:', error);
            this.snackBar.open('Error deleting account', 'OK', {
              duration: 2000,
            });
          }
        );
      }
    });
  }

  /**
   * Logs out the user and redirects to the welcome screen.
   */
  logoutAndRedirect(): void {
    // Clear all local storage (or session storage)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    // Navigate to the welcome/login screen
    this.router.navigate(['/welcome']);
  }

  /**
   * Navigates to the movie details page for a given movie title.
   * 
   * @param {string} movieTitle - The title of the movie to navigate to.
   */
  goToMovieDetails(movieTitle: string): void {
    this.router.navigate([`/movie-details/${movieTitle}`]);
  }
}
