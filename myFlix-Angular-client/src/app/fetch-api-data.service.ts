import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-4o5a.onrender.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService  {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  getAllMovies(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
    .pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }
  
  
  // Non-typed response extraction
  // private extractResponseData(res: Response): any {
    private extractResponseData(res: any): any { 
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    // Instead of throwError, return an observable with an error message
    return new Observable<never>(subscriber => {
      subscriber.error('Something bad happened; please try again later.');
    });
  }
  
}
