import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private fetchApiData: FetchApiDataService, private router: Router) {}

  handleSubmit(): void {
    this.loading = true;

    this.fetchApiData.userLogin(this.username, this.password).subscribe(
      (response: any) => {
        this.loading = false;
        // Store user data and token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Navigate to the movies list or wherever appropriate
        this.router.navigate(['movies']);
      },
      (error: any) => {
        this.loading = false;
        console.error('Login error:', error);
        this.errorMessage = 'Invalid username or password.';
      }
    );
  }
}
