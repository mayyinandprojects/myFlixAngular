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
      .post(apiUrl + 'user', userDetails)
      .pipe(catchError(this.handleError));
  }

    // Login method to get the token
    public userLogin(username: string, password: string): Observable<any> {
      const url = `${apiUrl}login?username=${username}&password=${password}`;
      
      return this.http.post(url, { username, password }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
    }
  
  // get the list of movies
  getAllMovies(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(apiUrl + 'movies', {
      headers: new HttpHeaders({
        // Authorization: 'Bearer ' + token
        Authorization: `Bearer ${token}`
      })
    })
    .pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

 // Making the api call to get one movie and details
 public getMovie(title: any): Observable<any> {
  console.log(title);
  return this.http.get(apiUrl + `movies/${title}`).pipe(
  catchError(this.handleError)
  );
}

 // Making the api call to get one director and biography
// Making the API call to get a director by name
public getDirectorByName(name: any): Observable<any> {
  console.log(name);
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.get(apiUrl + `director/${name}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to get movies by genre
public getMoviesByGenre(genre: any): Observable<any> {
  console.log(genre);
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.get(apiUrl + `movies/genre/${genre}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to get all users
public getAllUsers(): Observable<any> {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.get(apiUrl + `users`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to get favorite movies for a user by username and movie ID
public getFavoriteMovie(username: any, movieId: any): Observable<any> {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.get(apiUrl + `users/${username}/movies/${movieId}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to get favorite movies for a user by username and movie ID
public addFavoriteMovie(username: any, movieId: any): Observable<any> {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.post(apiUrl + `users/${username}/movies/${movieId}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to get favorite movies for a user by username and movie ID
public editUser(username: any, userDetails:any): Observable<any> {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.put(apiUrl + `users/${username}`, userDetails, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
      'Content-Type': 'application/json',
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to delete a user by username
public deleteUser(username: string): Observable<any> {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.delete(apiUrl + `users/${username}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to remove a movie from a user's favorites
public removeMovieFromFavorites(username: string, movieId: string): Observable<any> {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.delete(apiUrl + `users/${username}/movies/${movieId}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the headers
    }),
  }).pipe(
    catchError(this.handleError) // Handle any errors
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
