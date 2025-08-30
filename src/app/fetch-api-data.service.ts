import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const apiUrl = 'https://iecm-movies-app-6966360ed90e.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  userRegistration(userDetails: any): Observable<any> {
    // Format the data to match the API expectations
    const formattedData = {
      username: userDetails.Username,
      password: userDetails.Password,
      email: userDetails.Email,
      ...(userDetails.Birthday && { birthday: userDetails.Birthday })
    };
    
    return this.http.post(apiUrl + 'users', formattedData).pipe(
      catchError(this.handleError)
    );
  }

  userLogin(userDetails: any): Observable<any> {
    // Format the data to match the API expectations
    const formattedData = {
      username: userDetails.Username,
      password: userDetails.Password
    };
    
    return this.http.post(apiUrl + 'login', formattedData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    let errorMessage = 'An unexpected error occurred; please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid data provided. Please check your input.';
          break;
        case 401:
          errorMessage = 'Invalid username or password.';
          break;
        case 409:
          errorMessage = 'Username already exists. Please choose a different username.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Error: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
