import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  registerUser(): void {
    // Validate required fields
    if (!this.userData.Username || !this.userData.Password || !this.userData.Email) {
      this.snackBar.open('Please fill in all required fields', 'OK', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Format data for API
    const registrationData = {
      Username: this.userData.Username.trim(),
      Password: this.userData.Password,
      Email: this.userData.Email.trim(),
      Birthday: this.userData.Birthday || undefined
    };

    this.fetchApiData.userRegistration(registrationData).subscribe({
      next: (response) => {
        // Exercise 6.3 Requirement: Add console.log for debugging
        console.log('Registration successful:', response);
        
        this.dialogRef.close();
        this.snackBar.open('Registration successful! Please login with your new credentials.', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        // Exercise 6.3 Requirement: Add console.log for debugging
        console.log('Registration error:', error);
        
        this.snackBar.open(error.message || 'Registration failed. Please try again.', 'OK', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cancelRegistration(): void {
    this.dialogRef.close();
  }
}
