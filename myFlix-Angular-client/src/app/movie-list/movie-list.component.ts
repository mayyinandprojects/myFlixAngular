import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'; // Import your service

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  movies: any[] = [];  // Store movies here

  constructor(private fetchApiData: FetchApiDataService) { }  // Inject the service

  ngOnInit(): void {
    this.getMovies();  // Call getMovies() when the component is initialized
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (response: any) => {
        this.movies = response;  // Store the movie data in the movies array
        console.log(this.movies);  // Log movies to console to verify
      },
      (error: any) => {
        console.error(error);  // Log any error to console
      }
    );
  }
}
