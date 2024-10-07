import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  errorMessage: string = ''; // Declare the errorMessage property here

  constructor(private fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (data: any) => {
        this.movies = data;
        console.log('Movies:', this.movies);
      },
      (error: any) => {
        console.error('Error fetching movies:', error);
        this.errorMessage = 'Error fetching movies: ' + error; // Set error message here
      }
    );
  }
}
