import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://iecm-movies-app-6966360ed90e.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) { }
  public userRegistration(userDetails: any): Observable<any> { return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError)); }
  public userLogin(userDetails: any): Observable<any> { return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError)); }
  public getAllMovies(): Observable<any> { const token = localStorage.getItem('token'); return this.http.get(apiUrl + 'movies', { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }).pipe(map(this.extractResponseData), catchError(this.handleError)); }
  public getUser(username: string): Observable<any> { const token = localStorage.getItem('token'); return this.http.get(apiUrl + 'users/' + username, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }).pipe(map(this.extractResponseData), catchError(this.handleError)); }
  public addFavoriteMovie(username: string, movieId: string): Observable<any> { const token = localStorage.getItem('token'); return this.http.post(apiUrl + 'users/' + username + '/favorites/' + movieId, {}, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }).pipe(map(this.extractResponseData), catchError(this.handleError)); }
  public editUser(username: string, updatedUser: any): Observable<any> { const token = localStorage.getItem('token'); return this.http.put(apiUrl + 'users/' + username, updatedUser, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }).pipe(map(this.extractResponseData), catchError(this.handleError)); }
  public deleteUser(username: string): Observable<any> { const token = localStorage.getItem('token'); return this.http.delete(apiUrl + 'users/' + username, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }).pipe(map(this.extractResponseData), catchError(this.handleError)); }
  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> { const token = localStorage.getItem('token'); return this.http.delete(apiUrl + 'users/' + username + '/favorites/' + movieId, { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) }).pipe(map(this.extractResponseData), catchError(this.handleError)); }
  private extractResponseData(res: any): any { const body = res; return body || {}; }
  private handleError(error: HttpErrorResponse): any {
    if (error.error.errors) {
      const errorMessages = error.error.errors.map((err: any) => err.msg).join(', ');
      return throwError(() => new Error(errorMessages || 'Something bad happened; please try again later.'));
    }
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(error.error.message || error.error || 'Something bad happened; please try again later.'));
  }
}
