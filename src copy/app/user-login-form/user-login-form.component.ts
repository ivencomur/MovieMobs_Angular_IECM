import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent {
  @Input() loginData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  loginUser(): void {
    // Validate required fields
    if (!this.loginData.Username || !this.loginData.Password) {
      this.snackBar.open('Please enter both username and password', 'OK', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Format data for API
    const loginCredentials = {
      Username: this.loginData.Username.trim(),
      Password: this.loginData.Password
    };

    this.fetchApiData.userLogin(loginCredentials).subscribe({
      next: (result) => {
        // Exercise 6.3 Requirement: Add current user and token to localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        this.dialogRef.close();
        this.snackBar.open('Login successful! Welcome back!', 'OK', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        
        // Log success for debugging (as mentioned in Exercise)
        console.log('Login successful:', result);
        
        // Future navigation will be implemented in next exercises
        // this.router.navigate(['movies']);
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Login failed. Please check your credentials.', 'OK', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        
        // Log error for debugging
        console.log('Login error:', error);
      }
    });
  }

  cancelLogin(): void {
    this.dialogRef.close();
  }
}
