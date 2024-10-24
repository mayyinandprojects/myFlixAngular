// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for user registration, providing a form to input user details.
 * 
 * @class UserRegistrationFormComponent
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * User data object containing registration details.
   * 
   * @type {{ name: string, username: string, password: string, email: string, birthday: string }}
   * @default { name: '', username: '', password: '', email: '', birthday: '' }
   */
  @Input() userData = { name: '', username: '', password: '', email: '', birthday: '' };

  /** 
   * Flag to indicate loading state during registration.
   * 
   * @type {boolean}
   * @default false
   */
  isLoading = false;

  /**
   * Creates an instance of UserRegistrationFormComponent.
   * 
   * @param {FetchApiDataService} fetchApiData - Service for fetching API data.
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog for closing it on success.
   * @param {MatSnackBar} snackBar - Service for displaying notifications to the user.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after the component has been initialized.
   */
  ngOnInit(): void {}

  /**
   * Sends the user data to the backend for registration.
   * Displays a notification on success or failure.
   */
  registerUser(): void {
    this.isLoading = true; // Set loading state
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.isLoading = false; // Reset loading state
        this.dialogRef.close(); // Close the modal on success
        this.snackBar.open('User Registered', 'OK', {
          duration: 2000 // Notification duration
        });
      },
      (error) => {
        this.snackBar.open(error, 'OK', {
          duration: 2000 // Show error notification
        });
        this.isLoading = false; // Reset loading state
      }
    );
  }
}
