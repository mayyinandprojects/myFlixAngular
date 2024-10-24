// src/app/user-registration-form/user-login-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for handling user login.
 * 
 * @class UserLoginFormComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /** 
   * User data containing username and password. 
   * 
   * @type {{ Username: string; Password: string; }}
   */
  @Input() userData = { Username: '', Password: '' };

  /** 
   * Indicates if the login process is loading. 
   * 
   */
  isLoading = false;

  /**
   * Creates an instance of UserLoginFormComponent.
   * 
   * @param {FetchApiDataService} fetchApiData - Service for API calls.
   * @param {MatDialogRef<UserLoginFormComponent>} dialogRef - Reference to the dialog.
   * @param {MatSnackBar} snackBar - Service for displaying notifications.
   * @param {Router} router - Service for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /** 
   * Lifecycle hook that is called after the component has been initialized.
   */
  ngOnInit(): void {}

  /**
   * Logs in the user by sending username and password to the backend.
   * This function sets a loading state (starts the spinner), calls the userLogin method from the FetchApiDataService,
   * and handles the response to either navigate to the movies page or show an error message. 
   * Loading state stops and spinner stopped.
   */
  loginUser(): void {
    this.isLoading = true; // Start loading spinner
    this.fetchApiData
      .userLogin(this.userData.Username, this.userData.Password)
      .subscribe(
        (result) => {
          // Logic for a successful user login
          localStorage.setItem('userId', result.user._id);
          localStorage.setItem('token', result.token);
          this.dialogRef.close(); // Close the modal on success
          this.snackBar.open('Login successful', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['movies']); // Navigate to movies page
        },
        (error) => {
          this.snackBar.open('Login failed', 'OK', {
            duration: 2000,
          });
          this.isLoading = false; // Stop loading spinner
        }
      );
  }
}
