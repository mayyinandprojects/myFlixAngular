import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the API URL that will provide data for the client app
const apiUrl = 'https://movie-api-4o5a.onrender.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  // Making the API call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails)
      .pipe(
        catchError(this.handleError) // Error handling
      );
  }

// Making the API call for the user login
public userLogin(userDetails: any): Observable<any> {
  console.log(userDetails);
  return this.http.post(apiUrl + 'login', userDetails)  // Use the 'login' endpoint
    .pipe(
      catchError(this.handleError)  // Error handling
    );
}


  // Function to get all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token, // Authorization header with Bearer token
      })
    }).pipe(
      map((res: any) => this.extractResponseData(res)), // Adjusted response type
      catchError(this.handleError) // Error handling
    );
  }

    // Function to get details of one movie
    getMovie(): Observable<any> {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      return this.http.get(apiUrl + 'movies' + ':title', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token, // Authorization header with Bearer token
        })
      }).pipe(
        map((res: any) => this.extractResponseData(res)), // Adjusted response type
        catchError(this.handleError) // Error handling
      );
    }



  // Non-typed response extraction
  private extractResponseData(res: any): any {  // Changed type from Response to any
    return res || {};  // Return body or empty object
  }

  // Error handling function
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
