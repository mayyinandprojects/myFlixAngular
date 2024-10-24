// src/app/welcome-page/welcome-page.component.ts
import { Component, OnInit } from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component representing the welcome page of the application.
 * Provides options for user registration and login via modal dialogs.
 * 
 * @class WelcomePageComponent
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  title = 'myFlix-Angular-client'; // Title displayed on the welcome page

  /**
   * Creates an instance of the WelcomePageComponent.
   * 
   * @param {MatDialog} dialog - The Angular Material dialog service for opening dialogs.
   */
  constructor(public dialog: MatDialog) {}

  /**
   * Lifecycle hook that is called after the component has been initialized.
   */
  ngOnInit(): void {}

  /**
   * Opens the user registration dialog when the signup button is clicked.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      // Assigning the dialog a width
      width: '280px',
    });
  }

  /**
   * Opens the user login dialog when the login button is clicked.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      // Assigning the dialog a width
      width: '280px',
    });
  }
}
