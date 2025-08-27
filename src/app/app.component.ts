import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FetchApiDataService } from './fetch-api-data.service';

interface User {
  Username: string;
  Password: string;
  Email: string;
  Birthday: string;
}

interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Genre: any;
  Director: any;
  Actors: any[];
  ImagePath: string;
  Featured: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <h1>{{ title }}</h1>
        <nav *ngIf="isLoggedIn" class="nav-menu">
          <button (click)="setView('movies')" [class.active]="currentView === 'movies'">Movies</button>
          <button (click)="setView('profile')" [class.active]="currentView === 'profile'">Profile</button>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </nav>
      </header>

      <!-- Loading Indicator -->
      <div *ngIf="loading" class="loading">Loading...</div>

      <!-- Messages -->
      <div *ngIf="errorMessage" class="error-message" (click)="clearMessages()">
        {{ errorMessage }}
      </div>
      <div *ngIf="successMessage" class="success-message" (click)="clearMessages()">
        {{ successMessage }}
      </div>

      <!-- Login View -->
      <div *ngIf="currentView === 'login'" class="auth-container">
        <h2>Login to MovieMobs</h2>
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="loginData.Username" 
              name="username"
              required>
          </div>
          
          <div class="form-group">
            <label for="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="loginData.Password" 
              name="password"
              required>
          </div>
          
          <button type="submit" [disabled]="!loginForm.form.valid || loading">
            {{ loading ? 'Logging in...' : (errorMessage && !loading ? 'Try Again' : 'Login') }}
          </button>
        </form>
        
        <p>Don't have an account? 
          <button type="button" (click)="setView('register')" class="link-btn">Register here</button>
        </p>
      </div>

      <!-- Registration View -->
      <div *ngIf="currentView === 'register'" class="auth-container">
        <h2>Create Account</h2>
        <form (ngSubmit)="register()" #registerForm="ngForm">
          <div class="form-group">
            <label for="regUsername">Username:</label>
            <input 
              type="text" 
              id="regUsername" 
              [(ngModel)]="registerData.Username" 
              name="regUsername"
              required>
          </div>
          
          <div class="form-group">
            <label for="regPassword">Password:</label>
            <input 
              type="password" 
              id="regPassword" 
              [(ngModel)]="registerData.Password" 
              name="regPassword"
              required>
          </div>
          
          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="registerData.Email" 
              name="email"
              required>
          </div>
          
          <div class="form-group">
            <label for="birthday">Birthday:</label>
            <input 
              type="date" 
              id="birthday" 
              [(ngModel)]="registerData.Birthday" 
              name="birthday"
              required>
          </div>
          
          <button type="submit" [disabled]="!registerForm.form.valid || loading">
            {{ loading ? 'Registering...' : (errorMessage && !loading ? 'Try Again' : 'Register') }}
          </button>
        </form>
        
        <p>Already have an account? 
          <button type="button" (click)="setView('login')" class="link-btn">Login here</button>
        </p>
      </div>

      <!-- Movies View -->
      <div *ngIf="currentView === 'movies'" class="movies-container">
        <div class="welcome-section">
          <h2>Welcome, {{ currentUser?.Username }}!</h2>
          
          <!-- Search Section -->
          <div class="search-section">
            <div class="search-controls">
              <select [(ngModel)]="searchType" class="search-type">
                <option value="title">Search by Title</option>
                <option value="genre">Search by Genre</option>
                <option value="director">Search by Director</option>
                <option value="actor">Search by Actor</option>
              </select>
              
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="searchMovies()"
                placeholder="Search movies..."
                class="search-input">
              
              <button (click)="clearSearch()" class="clear-btn">Clear</button>
            </div>
            
            <p class="search-results">
              Showing {{ filteredMovies.length }} of {{ allMovies.length }} movies
            </p>
          </div>
        </div>

        <!-- Movies Grid -->
        <div class="movies-grid" *ngIf="filteredMovies.length > 0">
          <div *ngFor="let movie of filteredMovies" class="movie-card">
            <div class="movie-image">
              <img 
                [src]="movie.ImagePath || 'assets/no-image.png'" 
                [alt]="movie.Title"
                (error)="$event.target.src='assets/no-image.png'">
            </div>
            
            <div class="movie-info">
              <h3>{{ movie.Title }}</h3>
              <p class="movie-genre">{{ movie.Genre?.Name || 'Unknown Genre' }}</p>
              <p class="movie-director">Dir: {{ movie.Director?.Name || 'Unknown Director' }}</p>
              
              <div class="movie-actions">
                <button (click)="selectMovie(movie)" class="details-btn">Details</button>
                <button 
                  (click)="toggleFavorite(movie)" 
                  [class.favorited]="isFavorite(movie._id)"
                  class="favorite-btn">
                  {{ isFavorite(movie._id) ? '♥ Remove' : '♡ Add' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Movies Message -->
        <div *ngIf="filteredMovies.length === 0 && !loading" class="no-movies">
          <p>No movies found matching your search criteria.</p>
        </div>
      </div>

      <!-- Profile View -->
      <div *ngIf="currentView === 'profile'" class="profile-container">
        <h2>My Profile</h2>
        
        <div class="profile-section">
          <h3>Account Information</h3>
          <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
            <div class="form-group">
              <label for="editUsername">Username:</label>
              <input 
                type="text" 
                id="editUsername" 
                [(ngModel)]="editUserData.Username" 
                name="editUsername"
                required>
            </div>
            
            <div class="form-group">
              <label for="editEmail">Email:</label>
              <input 
                type="email" 
                id="editEmail" 
                [(ngModel)]="editUserData.Email" 
                name="editEmail"
                required>
            </div>
            
            <div class="form-group">
              <label for="editBirthday">Birthday:</label>
              <input 
                type="date" 
                id="editBirthday" 
                [(ngModel)]="editUserData.Birthday" 
                name="editBirthday"
                required>
            </div>
            
            <div class="form-group">
              <label for="editPassword">New Password (leave blank to keep current):</label>
              <input 
                type="password" 
                id="editPassword" 
                [(ngModel)]="editUserData.Password" 
                name="editPassword">
            </div>
            
            <button type="submit" [disabled]="loading" class="update-btn">
              {{ loading ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </div>

        <!-- Favorite Movies Section -->
        <div class="favorites-section">
          <h3>My Favorite Movies ({{ favoriteMovies.length }})</h3>
          <div class="favorite-movies" *ngIf="favoriteMovies.length > 0">
            <div *ngFor="let movieId of favoriteMovies" class="favorite-movie">
              <ng-container *ngFor="let movie of allMovies">
                <div *ngIf="movie._id === movieId" class="favorite-item">
                  <span>{{ movie.Title }}</span>
                  <button (click)="removeFavorite(movie)" class="remove-fav">Remove</button>
                </div>
              </ng-container>
            </div>
          </div>
          <p *ngIf="favoriteMovies.length === 0">No favorite movies yet.</p>
        </div>

        <!-- Danger Zone -->
        <div class="danger-zone">
          <h3>Danger Zone</h3>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button (click)="deleteAccount()" class="delete-account-btn">Delete Account</button>
        </div>
      </div>

      <!-- Movie Details Modal -->
      <div *ngIf="selectedMovie" class="modal-overlay" (click)="closeMovieDetails()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ selectedMovie.Title }}</h2>
            <button (click)="closeMovieDetails()" class="close-btn">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="movie-details">
              <img 
                [src]="selectedMovie.ImagePath || 'assets/no-image.png'" 
                [alt]="selectedMovie.Title"
                class="movie-poster">
              
              <div class="movie-meta">
                <p><strong>Description:</strong> {{ selectedMovie.Description }}</p>
                <p><strong>Genre:</strong> {{ selectedMovie.Genre?.Name || 'Unknown' }}</p>
                <p><strong>Director:</strong> {{ selectedMovie.Director?.Name || 'Unknown' }}</p>
                <p *ngIf="selectedMovie.Director?.Bio">
                  <strong>Director Bio:</strong> {{ selectedMovie.Director.Bio }}
                </p>
                <p *ngIf="selectedMovie.Director?.Birth">
                  <strong>Director Birth:</strong> {{ formatDate(selectedMovie.Director.Birth) }}
                </p>
                
                <div *ngIf="selectedMovie.Actors && selectedMovie.Actors.length > 0">
                  <strong>Actors:</strong>
                  <ul>
                    <li *ngFor="let actor of selectedMovie.Actors">
                      {{ actor.Name }}
                      <span *ngIf="actor.Bio"> - {{ actor.Bio }}</span>
                    </li>
                  </ul>
                </div>

                <button 
                  (click)="toggleFavorite(selectedMovie)" 
                  [class.favorited]="isFavorite(selectedMovie._id)"
                  class="favorite-btn-modal">
                  {{ isFavorite(selectedMovie._id) ? '♥ Remove from Favorites' : '♡ Add to Favorites' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Variables and Global Styles */
    .app-container {
      min-height: 100vh;
      background-color: #ecf0f1;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #2c3e50;
    }

    /* Header */
    .app-header {
      background-color: #2c3e50;
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 24px;
    }
    
    .nav-menu {
      display: flex;
      gap: 10px;
    }
    
    .nav-menu button {
      background-color: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .nav-menu button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
    
    .nav-menu button.active {
      background-color: #3498db;
    }
    
    .logout-btn {
      background-color: #e74c3c !important;
    }
    
    .logout-btn:hover {
      background-color: #c0392b !important;
    }

    /* Loading and Messages */
    .loading {
      text-align: center;
      padding: 50px;
      font-size: 18px;
      color: #3498db;
    }

    .error-message, .success-message {
      padding: 15px;
      margin: 20px;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      font-weight: bold;
    }

    .error-message {
      background-color: #fadbd8;
      color: #e74c3c;
      border: 1px solid #e74c3c;
    }

    .success-message {
      background-color: #d5f4e6;
      color: #27ae60;
      border: 1px solid #27ae60;
    }

    /* Authentication Forms */
    .auth-container {
      max-width: 400px;
      margin: 50px auto;
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .auth-container h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #bdc3c7;
      border-radius: 5px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
    
    button[type="submit"] {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
      transition: all 0.3s ease;
    }
    
    button[type="submit"]:hover:not(:disabled) {
      background-color: #2980b9;
      transform: translateY(-1px);
    }
    
    button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .link-btn {
      background: none;
      border: none;
      color: #3498db;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
      font-size: inherit;
    }
    
    .link-btn:hover {
      color: #2980b9;
    }

    /* Movies Container */
    .movies-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-section {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    
    .welcome-section h2 {
      margin-top: 0;
      color: #2c3e50;
    }
    
    .search-section {
      margin-top: 30px;
    }
    
    .search-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    
    .search-type {
      padding: 10px;
      border: 1px solid #bdc3c7;
      border-radius: 5px;
      font-size: 14px;
      min-width: 150px;
    }
    
    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 10px;
      border: 1px solid #bdc3c7;
      border-radius: 5px;
      font-size: 14px;
    }
    
    .clear-btn {
      background-color: #f39c12;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .clear-btn:hover {
      background-color: #d68910;
    }
    
    .search-results {
      color: #2c3e50;
      font-style: italic;
      margin: 0;
    }

    /* Movies Grid */
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    
    .movie-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
    
    .movie-card:hover {
      transform: translateY(-5px);
    }
    
    .movie-image {
      width: 100%;
      height: 300px;
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .movie-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .movie-image:hover img {
      transform: scale(1.05);
    }
    
    .movie-info h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 18px;
    }
    
    .movie-genre {
      color: #3498db;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .movie-director {
      color: #2c3e50;
      margin: 5px 0 15px 0;
    }
    
    .movie-actions {
      display: flex;
      gap: 10px;
    }
    
    .details-btn {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      flex: 1;
      transition: all 0.3s ease;
    }
    
    .details-btn:hover {
      background-color: #2980b9;
    }
    
    .favorite-btn {
      background-color: #bdc3c7;
      color: #2c3e50;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      flex: 1;
      transition: all 0.3s ease;
    }
    
    .favorite-btn:hover {
      background-color: #95a5a6;
    }
    
    .favorite-btn.favorited {
      background-color: #e74c3c;
      color: white;
    }
    
    .favorite-btn.favorited:hover {
      background-color: #c0392b;
    }

    /* Profile */
    .profile-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .profile-container h2 {
      color: #2c3e50;
      margin-bottom: 30px;
    }
    
    .profile-section, .favorites-section, .danger-zone {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    
    .profile-section h3, .favorites-section h3, .danger-zone h3 {
      margin-top: 0;
      color: #2c3e50;
      border-bottom: 2px solid #bdc3c7;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    
    .update-btn {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .update-btn:hover:not(:disabled) {
      background-color: #2980b9;
    }
    
    .favorite-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px solid #bdc3c7;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    
    .favorite-item span {
      font-weight: bold;
    }
    
    .remove-fav {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .remove-fav:hover {
      background-color: #c0392b;
    }
    
    .danger-zone {
      border: 2px solid #e74c3c;
    }
    
    .danger-zone h3 {
      color: #e74c3c;
      border-bottom-color: #e74c3c;
    }
    
    .delete-account-btn {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .delete-account-btn:hover {
      background-color: #c0392b;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 10px;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      margin: 20px;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #bdc3c7;
    }
    
    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #2c3e50;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      background-color: #bdc3c7;
      border-radius: 50%;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .movie-details {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
    }
    
    .movie-poster {
      width: 100%;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .movie-meta p {
      margin-bottom: 15px;
      line-height: 1.6;
    }
    
    .movie-meta strong {
      color: #2c3e50;
    }
    
    .movie-meta ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .movie-meta li {
      margin-bottom: 5px;
    }
    
    .favorite-btn-modal {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
      transition: all 0.3s ease;
    }
    
    .favorite-btn-modal:hover {
      background-color: #2980b9;
    }
    
    .favorite-btn-modal.favorited {
      background-color: #e74c3c;
    }
    
    .favorite-btn-modal.favorited:hover {
      background-color: #c0392b;
    }

    .no-movies {
      text-align: center;
      padding: 50px;
      color: #2c3e50;
      font-size: 18px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .app-header {
        flex-direction: column;
        gap: 15px;
      }
      
      .nav-menu {
        width: 100%;
        justify-content: center;
      }
      
      .movies-grid {
        grid-template-columns: 1fr;
      }
      
      .search-controls {
        flex-direction: column;
      }
      
      .search-type, .search-input {
        min-width: 100%;
      }
      
      .movie-actions {
        flex-direction: column;
      }
      
      .auth-container {
        margin: 20px;
      }
      
      .movie-details {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'MovieMobsAngular';
  private apiService = inject(FetchApiDataService);

  // Authentication state
  isLoggedIn = false;
  currentUser: any = null;
  token: string | null = null;

  // Current view state
  currentView: 'login' | 'register' | 'movies' | 'profile' = 'login';

  // Form data
  loginData = { Username: '', Password: '' };
  registerData: User = { Username: '', Password: '', Email: '', Birthday: '' };
  editUserData: User = { Username: '', Password: '', Email: '', Birthday: '' };

  // Movie data
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  favoriteMovies: string[] = [];
  selectedMovie: Movie | null = null;

  // Search/filter
  searchTerm = '';
  searchType: 'title' | 'genre' | 'director' | 'actor' = 'title';

  // Loading and error states
  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.checkExistingLogin();
  }

  // Authentication methods
  checkExistingLogin() {
    this.token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (this.token && username) {
      this.isLoggedIn = true;
      this.currentView = 'movies';
      this.loadUserData(username);
      this.loadAllMovies();
    }
  }

  register() {
    this.loading = true;
    this.clearMessages();
    
    this.apiService.userRegistration(this.registerData).subscribe({
      next: (result) => {
        this.successMessage = 'Registration successful! Please log in.';
        this.currentView = 'login';
        this.registerData = { Username: '', Password: '', Email: '', Birthday: '' };
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Registration failed. Please try again.';
        // Clear the form on error to allow user to re-enter information
        this.registerData = { Username: '', Password: '', Email: '', Birthday: '' };
        this.loading = false;
      }
    });
  }

  login() {
    this.loading = true;
    this.clearMessages();

    this.apiService.userLogin(this.loginData).subscribe({
      next: (result) => {
        this.token = result.token;
        this.currentUser = result.user;
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.Username);
        
        this.isLoggedIn = true;
        this.currentView = 'movies';
        this.loadAllMovies();
        this.loadFavoriteMovies();
        this.loginData = { Username: '', Password: '' };
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        // Clear the form on error
        this.loginData = { Username: '', Password: '' };
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.currentUser = null;
    this.token = null;
    this.currentView = 'login';
    this.allMovies = [];
    this.filteredMovies = [];
    this.favoriteMovies = [];
    this.clearMessages();
  }

  // User management
  loadUserData(username: string) {
    this.apiService.getUser(username).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.editUserData = { 
          Username: user.Username, 
          Password: '', 
          Email: user.Email, 
          Birthday: this.formatDateForInput(user.Birthday) 
        };
      },
      error: (error) => console.error('Failed to load user data:', error)
    });
  }

  updateProfile() {
    this.loading = true;
    this.clearMessages();

    const updateData: any = { ...this.editUserData };
    if (!updateData.Password) {
      delete updateData.Password;
    }

    this.apiService.editUser(this.currentUser.Username, updateData).subscribe({
      next: (result) => {
        this.currentUser = result;
        this.successMessage = 'Profile updated successfully!';
        this.loading = false;
        // Update localStorage if username changed
        if (result.Username !== this.currentUser.Username) {
          localStorage.setItem('username', result.Username);
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile.';
        this.loading = false;
      }
    });
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      this.apiService.deleteUser(this.currentUser.Username).subscribe({
        next: () => {
          this.logout();
          this.successMessage = 'Account deleted successfully.';
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete account.';
        }
      });
    }
  }

  // Movie data methods
  loadAllMovies() {
    this.loading = true;
    this.apiService.getAllMovies().subscribe({
      next: (movies) => {
        this.allMovies = movies;
        this.filteredMovies = movies;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load movies.';
        this.loading = false;
      }
    });
  }

  loadFavoriteMovies() {
    if (this.currentUser) {
      this.apiService.getUser(this.currentUser.Username).subscribe({
        next: (user: any) => {
          this.favoriteMovies = user.FavoriteMovies || [];
        },
        error: (error: any) => console.error('Failed to load favorites:', error)
      });
    }
  }

  // Search and filter methods
  searchMovies() {
    if (!this.searchTerm.trim()) {
      this.filteredMovies = this.allMovies;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    
    this.filteredMovies = this.allMovies.filter(movie => {
      switch (this.searchType) {
        case 'title':
          return movie.Title.toLowerCase().includes(term);
        case 'genre':
          return movie.Genre?.Name?.toLowerCase().includes(term);
        case 'director':
          return movie.Director?.Name?.toLowerCase().includes(term);
        case 'actor':
          return movie.Actors?.some(actor => 
            actor.Name?.toLowerCase().includes(term)
          );
        default:
          return false;
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredMovies = this.allMovies;
  }

  // Favorite management
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  toggleFavorite(movie: Movie) {
    if (this.isFavorite(movie._id)) {
      this.removeFavorite(movie);
    } else {
      this.addFavorite(movie);
    }
  }

  addFavorite(movie: Movie) {
    this.apiService.addFavoriteMovie(this.currentUser.Username, movie._id).subscribe({
      next: () => {
        this.favoriteMovies.push(movie._id);
        this.successMessage = `${movie.Title} added to favorites!`;
        setTimeout(() => this.clearMessages(), 2000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to add to favorites.';
        setTimeout(() => this.clearMessages(), 2000);
      }
    });
  }

  removeFavorite(movie: Movie) {
    this.apiService.deleteFavoriteMovie(this.currentUser.Username, movie._id).subscribe({
      next: () => {
        this.favoriteMovies = this.favoriteMovies.filter(id => id !== movie._id);
        this.successMessage = `${movie.Title} removed from favorites!`;
        setTimeout(() => this.clearMessages(), 2000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to remove from favorites.';
        setTimeout(() => this.clearMessages(), 2000);
      }
    });
  }

  // Movie details
  selectMovie(movie: Movie) {
    this.selectedMovie = movie;
  }

  closeMovieDetails() {
    this.selectedMovie = null;
  }

  // View navigation
  setView(view: 'login' | 'register' | 'movies' | 'profile') {
    this.currentView = view;
    this.clearMessages();
  }

  // Utility methods
  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}