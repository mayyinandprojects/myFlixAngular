// src/app/movie-details/movie-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // To get route parameters
import { FetchApiDataService } from '../fetch-api-data.service';  // To use the API service

/**
 * Component to display the details of a specific movie.
 * 
 * @class MovieDetailsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  /** Variable to hold the movie details. */
  movie: any; 

  /**
   * Creates an instance of MovieDetailsComponent.
   * 
   * @param {ActivatedRoute} route - To get the movie title from the route.
   * @param {FetchApiDataService} fetchApiData - API service to make the call for movie details.
   */
  constructor(
    private route: ActivatedRoute,
    private fetchApiData: FetchApiDataService
  ) {}

  /** Lifecycle hook that is called after the component is initialized. */
  ngOnInit(): void {
    this.getMovieDetails(); // Fetch movie details on initialization
  }

  /**
   * Fetches movie details based on the movie title from the route parameters.
   */
  getMovieDetails(): void {
    const movieTitle = this.route.snapshot.paramMap.get('title');
    
    // Log the movie title to verify it's coming from the route correctly
    console.log('Movie title from route:', movieTitle);
  
    if (movieTitle) {
      this.fetchApiData.getMovie(movieTitle).subscribe(
        (response: any) => {
          console.log('Movie details response:', response);  // Log the API response
          this.movie = response;  // Assign the response to the movie variable
        }, 
        (error: any) => {
          console.error('Error fetching movie details:', error);  // Log the error if API fails
        }
      );
    }
  }
}
