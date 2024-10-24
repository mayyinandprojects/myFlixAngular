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

/**
 * Service responsible for interacting with the backend API.
 * Provides methods for user registration, login, and data fetching.
 * @class FetchApiDataService
 */
export class FetchApiDataService {
  /**
   * Creates an instance of FetchApiDataService.
   * Injects the HttpClient to enable HTTP communication with the backend API.
   * @param {HttpClient} http - Angular's HttpClient used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves the authentication token from local storage.
   * @private
   * @returns {string | null} The token if found, otherwise null.
   */
  private getToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }

  /**
   * Creates and returns an HTTP header with the bearer token authorization and content type.
   * @private
   * @returns {HttpHeaders} A new HttpHeaders object containing the authorization and content type headers.
   */
  private createAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Makes an API call to register a new user.
   * Sends user details to the backend to create a new account.
   *
   * @param {Object} userDetails - An object containing the user's registration details.
   * @returns {Observable<any>} An Observable containing the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Login method to authenticate a user and get a token.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Observable<any>} An observable containing the token.
   */
  public userLogin(username: string, password: string): Observable<any> {
    const url = `${apiUrl}login?username=${username}&password=${password}`;
    return this.http.post(url, { username, password }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches the list of all movies.
   * @returns {Observable<any[]>} An observable containing an array of movies.
   */
  public getAllMovies(): Observable<any[]> {
    return this.http
      .get<any[]>(apiUrl + 'movies', {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetches details of a specific movie by title.
   * @param {string} title - The title of the movie.
   * @returns {Observable<any>} An observable containing movie details.
   */
  public getMovie(title: string): Observable<any> {
    console.log('Fetching movie with title:', title);
    return this.http
      .get(apiUrl + `movies/${title}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the biography of a director by name.
   * @param {any} name - The name of the director.
   * @returns {Observable<any>} An observable containing director details.
   */
  public getDirectorByName(name: any): Observable<any> {
    console.log(name);
    return this.http
      .get(apiUrl + `director/${name}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches movies by genre.
   * @param {any} genre - The genre of the movies.
   * @returns {Observable<any>} An observable containing the list of movies.
   */
  public getMoviesByGenre(genre: any): Observable<any> {
    console.log(genre);
    return this.http
      .get(apiUrl + `movies/genre/${genre}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the list of all users.
   * @returns {Observable<any>} An observable containing the list of users.
   */
  public getAllUsers(): Observable<any> {
    return this.http
      .get(apiUrl + `users`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches details of a user by their user ID.
   * @param {string} userId - The user ID.
   * @returns {Observable<User | undefined>} An observable containing user details.
   */
  public getUserById(userId: string): Observable<User | undefined> {
    return this.http
      .get<User[]>(`${apiUrl}users`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(
        map((users: User[]) => users.find((user) => user._id === userId)),
        catchError(this.handleError)
      );
  }

  /**
   * Fetches a favorite movie for a user by username and movie ID.
   * @param {any} username - The username of the user.
   * @param {any} movieId - The ID of the movie.
   * @returns {Observable<any>} An observable containing the favorite movie details.
   */
  public getFavoriteMovie(username: any, movieId: any): Observable<any> {
    return this.http
      .get(apiUrl + `users/${username}/movies/${movieId}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Edits user details.
   * @param {any} username - The username of the user.
   * @param {any} userDetails - The new details to update for the user.
   * @returns {Observable<any>} An observable containing the updated user details.
   */
  public editUser(username: any, userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + `users/${username}`, userDetails, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user by their username.
   * @param {string} username - The username of the user to delete.
   * @returns {Observable<any>} An observable indicating the result of the delete operation.
   */
  public deleteUser(username: string): Observable<any> {
    console.log(`Attempting to delete user with username: ${username}`);
    return this.http
      .delete(apiUrl + `users/${username}`, {
        headers: this.createAuthorizationHeader(),
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Adds a movie to a user's favorites.
   * @param {string | null} username - The username of the user.
   * @param {string} movieId - The ID of the movie.
   * @returns {Observable<any>} An observable indicating the result of the add operation.
   */
  public addFavoriteMovie(
    username: string | null,
    movieId: string
  ): Observable<any> {
    console.log('add fav movies:  username:' + username + '  id' + movieId);
    return this.http
      .post(
        `${apiUrl}users/${username}/movies/${movieId}`,
        {},
        {
          headers: this.createAuthorizationHeader(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes a movie from a user's favorites.
   * @param {string | null} username - The username of the user.
   * @param {string} movieId - The ID of the movie to remove from favorites.
   * @returns {Observable<any>} An observable indicating the result of the remove operation.
   */
  public removeFavoriteMovie(
    username: string | null,
    movieId: string
  ): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${username}/movies/${movieId}`, {
        headers: this.createAuthorizationHeader(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Extracts the response data.
   * @param {any} res - The response object.
   * @returns {any} The response data.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handles HTTP request errors.
   * @param {HttpErrorResponse} error - The HTTP error response.
   * @returns {Observable<never>} An observable that emits an error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error(
        'A client-side or network error occurred:',
        error.error.message
      );
    } else {
      console.error(
        `Error Status code ${error.status}, Error body is: ${error.error}`
      );
    }
    return new Observable<never>((subscriber) => {
      subscriber.error(
        error.status >= 200 && error.status < 300
          ? 'Request was successful but failed to process.'
          : 'Something bad happened; please try again later.'
      );
    });
  }
}
