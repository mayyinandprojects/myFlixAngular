import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './user.model'; // Create a model for User, see user.model.ts

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

  private getToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }



  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
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
    return this.http.get<any[]>(apiUrl + 'movies', {
      headers: this.createAuthorizationHeader(),
    })
    .pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

 // Making the api call to get one movie and details
 public getMovie(title: string): Observable<any> {
  console.log('Fetching movie with title:', title);
  return this.http.get(apiUrl + `movies/${title}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
  catchError(this.handleError)
  );
}

 // Making the api call to get one director and biography
// Making the API call to get a director by name
public getDirectorByName(name: any): Observable<any> {
  console.log(name);
    return this.http.get(apiUrl + `director/${name}`, {
      headers: this.createAuthorizationHeader(),
    }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to get movies by genre
public getMoviesByGenre(genre: any): Observable<any> {
  console.log(genre);
  const token = localStorage.getItem('token'); // Get the token from localStorage
  return this.http.get(apiUrl + `movies/genre/${genre}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to get all users
public getAllUsers(): Observable<any> {
  return this.http.get(apiUrl + `users`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Service Method to Get All Users and Filter by Logged-in User ID
public getUserById(userId: string): Observable<User | undefined> {
  return this.http.get<User[]>(`${apiUrl}users`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map((users: User[]) => users.find(user => user._id === userId)),
    catchError(this.handleError)
  );
}


// Making the API call to get favorite movies for a user by username and movie ID
public getFavoriteMovie(username: any, movieId: any): Observable<any> {
  return this.http.get(apiUrl + `users/${username}/movies/${movieId}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Fetch all favorite movies for a user by username
// public getUserFavoriteMovies(username: string): Observable<any> {
//   return this.http.get(`${apiUrl}users/${username}/movies`, {
//     headers: this.createAuthorizationHeader(),
//   }).pipe(
//     catchError(this.handleError) // Handle errors
//   );
// }




// Making the API call to get favorite movies for a user by username and movie ID
public editUser(username: any, userDetails:any): Observable<any> {
  return this.http.put(apiUrl + `users/${username}`, userDetails, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Making the API call to delete a user by username
public deleteUser(username: string): Observable<any> {
  console.log(`Attempting to delete user with username: ${username}`);
  return this.http.delete(apiUrl + `users/${username}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    catchError(this.handleError) // Handle any errors
  );
}

// Add a movie to favorites
public addFavoriteMovie(username: string | null, movieId: string): Observable<any> {
  console.log('add fav movies:  username:' + username + '  id' + movieId);
  return this.http.post(`${apiUrl}users/${username}/movies/${movieId}`, {}, {
    headers: this.createAuthorizationHeader(),
  }).pipe(catchError(this.handleError));
}

// Remove a movie from favorites
public removeFavoriteMovie(username: string | null, movieId: string): Observable<any> {
  return this.http.delete(`${apiUrl}users/${username}/movies/${movieId}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(catchError(this.handleError));
}
 
  
  // Non-typed response extraction
  // private extractResponseData(res: Response): any {
    private extractResponseData(res: any): any { 
    const body = res;
    return body || {};
  }

  
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('A client-side or network error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    // Instead of throwError, return an observable with an error message
    // Return an error observable only for non-success status codes
    //only invoke the error handling when the HTTP status is not 2xx (indicating an error).
    return new Observable<never>(subscriber => {
      subscriber.error(error.status >= 200 && error.status < 300 ? 
        'Request was successful but failed to process.' : 
        'Something bad happened; please try again later.'
      );
    });
  }
  
  
}
