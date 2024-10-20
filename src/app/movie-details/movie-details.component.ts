import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // To get route parameters
import { FetchApiDataService } from '../fetch-api-data.service';  // To use the API service

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: any; // Variable to hold the movie details

  constructor(
    private route: ActivatedRoute,              // To get the movie title from the route
    private fetchApiData: FetchApiDataService    // API service to make the call
  ) {}

  ngOnInit(): void {
    this.getMovieDetails();
  }

  getMovieDetails(): void {
    const movieTitle = this.route.snapshot.paramMap.get('title');
    
    // Log the movie title to make sure it's coming from the route correctly
    console.log('Movie title from route:', movieTitle);
  
    if (movieTitle) {
      this.fetchApiData.getMovie(movieTitle).subscribe((response: any) => {
        console.log('Movie details response:', response);  // Log the API response
        this.movie = response;
      }, (error: any) => {
        console.error('Error fetching movie details:', error);  // Log the error if API fails
      });
    }
  }
}
