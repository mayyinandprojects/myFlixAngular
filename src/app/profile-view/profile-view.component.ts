// src/app/profile-view/profile-view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To capture route params
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; // For navigation
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Import dialog

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
  userInfo: any = {};
  updatedUserInfo: any = {};
  isEditing = false; // Tracks if the user is in edit mode
  userId: string | null = null; // To store the captured userId
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router, // Inject ActivatedRoute to access route params
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getUserInfo(userId);
    }
  }

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

  //Helper method to format the date for date input field
  formatDateForInput(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    return parsedDate.toISOString().substring(0, 10); // YYYY-MM-DD format for input[type="date"]
  }


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
  // Toggle edit mode (same as before)
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updatedUserInfo = { ...this.userInfo }; // Reset the form if the user cancels editing
    }
  }

  // Check if the movie is in the user's favorite movies list
  isFavorite(movie: any): boolean {
    return this.userInfo.favorite_movies.includes(movie._id);
  }

  // Toggle the favorite status of the movie
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

  // Open the confirmation dialog and delete account if confirmed
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

  // Logout user and redirect to welcome screen
  logoutAndRedirect(): void {
    // Clear all local storage (or session storage)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    // Navigate to the welcome/login screen
    this.router.navigate(['/welcome']);
  }

  goToMovieDetails(movieTitle: string): void {
    this.router.navigate([`/movie-details/${movieTitle}`]);
  }
}
