// src/app/profile-view/profile-view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To capture route params
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

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
    private router: ActivatedRoute, // Inject ActivatedRoute to access route params
    private snackBar: MatSnackBar
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


// getFavoriteMovies(movieIds: string[]): void {
//   this.favoriteMovies = []; 
//   movieIds.forEach(id => {
//     this.fetchApiData.getMovie(id).subscribe((movie: any) => {
//       this.favoriteMovies.push(movie); 
//       console.log(movie);
//     }, error => {
//       console.error('Error fetching favorite movie:', error);
//     });
//   });
// }

getAllMoviesAndFavorites(movieIds: string[]): void {
  this.favoriteMovies = []; // Reset favorite movies

  // First, fetch all movies
  this.fetchApiData.getAllMovies().subscribe((allMovies: any[]) => {
    // Map the movie IDs to their corresponding movies
    movieIds.forEach(id => {
      const matchedMovie = allMovies.find(movie => movie._id === id);
      if (matchedMovie) {
        this.favoriteMovies.push(matchedMovie); // Add the matched movie to favorites
        console.log('Matched favorite movie:', matchedMovie);
      } else {
        console.error('No movie found for ID:', id);
      }
    });
  }, error => {
    console.error('Error fetching all movies:', error);
  });
}




  //Helper method to format the date for date input field
  formatDateForInput(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    return parsedDate.toISOString().substring(0, 10); // YYYY-MM-DD format for input[type="date"]
  }


  // Save the updated profile (same as before)
  // saveProfile(): void {
  //   if (this.userId) {
  //     this.fetchApiData.editUser(this.userId, this.updatedUserInfo).subscribe(
  //       (response: any) => {
  //         this.snackBar.open('Profile updated successfully', 'OK', {
  //           duration: 2000,
  //         });
  //         this.userInfo = { ...this.updatedUserInfo }; // Update displayed user info
  //         this.isEditing = false;
  //       },
  //       (error) => {
  //         this.snackBar.open('Error updating profile', 'OK', {
  //           duration: 2000,
  //         });
  //       }
  //     );
  //   }
  // }

  saveProfile(): void {
    if (this.userInfo && this.userInfo.username) {
      this.fetchApiData.editUser(this.userInfo.username, this.updatedUserInfo).subscribe(
        (response: any) => {
          this.snackBar.open('Profile updated successfully', 'OK', { duration: 2000 });
          // Update displayed user info after successful update
          this.userInfo = { ...this.updatedUserInfo };
          this.isEditing = false; // Exit edit mode
        },
        (error) => {
          this.snackBar.open('Error updating profile', 'OK', { duration: 2000 });
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
  
  // Call the API to add/remove from favorites
  if (isFav) {
    this.fetchApiData.removeFavoriteMovie(this.userInfo._id, movie._id).subscribe((response: any) => {
      console.log(`${movie.title} removed from favorites`);
      this.userInfo.favorite_movies = this.userInfo.favorite_movies.filter((id: string) => id !== movie._id);
    });
  } else {
    this.fetchApiData.addFavoriteMovie(this.userInfo._id,movie._id).subscribe((response: any) => {
      console.log(`${movie.title} added to favorites`);
      this.userInfo.favorite_movies.push(movie._id);
    });
  }
}

}
