# MovieMobs Angular Client

This is the frontend client for the MovieMobs application, built with Angular. It provides a clean, modern, and responsive user interface for interacting with the MovieMobs API.

## Features

* **Full User Authentication**: Secure user registration, login, and logout functionality.
* **Movie Browsing**: View the complete list of movies after logging in.
* **Powerful Search & Filtering**: Dynamically search and filter movies by Title, Genre, Director, or Actor.
* **Detailed Movie Information**: Click on any movie to see a detailed modal view with its description, genre, director, and actors.
* **Favorites Management**: Add movies to, or remove them from, your personal list of favorites.
* **User Profile Management**: View and update your personal information (username, email, birthday).
* **Account De-registration**: A secure option to permanently delete your user account.
* **Responsive Design**: The interface is optimized for a seamless experience on both desktop and mobile devices.

## Visual Theme & Color Palette

The application uses a modern and clean aesthetic with a consistent color scheme to enhance user experience.

* `#2c3e50` (Dark Slate Blue): Used for the main header background and primary text, providing a strong, professional base.
* `#ecf0f1` (Light Gray): The main background color for the application, offering a soft, neutral canvas.
* `#3498db` (Primary Blue): The primary action color used for main buttons, navigation highlights, and important links.
* `#e74c3c` (Danger Red): Used for destructive actions like logout, delete account, and removing favorites.
* `#f39c12` (Warning Orange): Used for secondary actions like the "Clear Search" button.
* `#27ae60` (Success Green): Used for success message popups.
* `#ffffff` (White): Used for text on dark backgrounds and the background of cards and modals.

## Setup and Usage

To run this project locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the Development Server**:
    ```bash
    ng serve --open
    ```
The application will be available at `http://localhost:4200/`.

## Key API Endpoints Used

This Angular application consumes the following endpoints from the MovieMobs API:

* `POST /login`: User Authentication
* `POST /users`: User Registration
* `GET /users/:username`: Get User Profile
* `PUT /users/:username`: Update User Profile
* `DELETE /users/:username`: De-register User
* `POST /users/:username/favorites/:movieId`: Add Favorite Movie
* `DELETE /users/:username/favorites/:movieId`: Remove Favorite Movie
* `GET /movies`: Get All Movies

