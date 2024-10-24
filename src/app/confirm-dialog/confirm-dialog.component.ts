// src/app/confirm-dialog/confirm-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Component for displaying a confirmation dialog.
 * In this project this is used for the Delete Account button in the profile-view component. 
 * This dialog prompts the user to confirm or cancel an action.
 * 
 * @class ConfirmDialogComponent
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  /**
   * Creates an instance of ConfirmDialogComponent.
   * 
   * @param {MatDialogRef<ConfirmDialogComponent>} dialogRef - Reference to the dialog, used to close it.
   */
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  /**
   * Closes the dialog without confirming the action.
   */
  onNoClick(): void {
    this.dialogRef.close(false); // Close the dialog, no action taken
  }

  /**
   * Closes the dialog and confirms the action.
   */
  onYesClick(): void {
    this.dialogRef.close(true); // Confirm the action
  }
}
