# MovieMobs - Angular Movie Discovery App

A movie discovery application built with Angular 19 and Angular Material. Create an account, log in, and get ready to explore movies.

## What This App Does

MovieMobs helps you discover movies. Right now, you can sign up for an account and log in. More movie features are coming in future updates.

## Getting Started

### Requirements
- Node.js (version 18 or newer)
- npm 
- A code editor

### Setup
1. Clone or download this project
2. Open terminal in the project folder
3. Run `npm install`
4. Run `ng serve --open`
5. The app opens at `http://localhost:4200`

## Using the App

**Sign Up**: Click "Sign Up" and fill in your details. You need a username, password, and email. Birthday is optional.

**Login**: Click "Login" and enter your username and password.

The app saves your login information so you stay logged in.

## Development Notes

This project uses Angular 19 with standalone components and Angular Material for the interface. The forms connect to a movie API for user registration and authentication.

### A Note on Framework Evolution

Building this application revealed how quickly web development moves. The original exercise materials contained outdated syntax and deprecated methods that no longer work with current Angular versions. Several compatibility issues had to be resolved:

- Angular Material theming syntax changed significantly between versions 17-19
- The old `mat.define-palette()` functions were replaced with `mat.theme()` 
- Component imports shifted from NgModule to standalone architecture
- Animation providers moved from async to synchronous loading
- API field naming conventions differed from exercise examples

These version mismatches meant extensive trial-and-error debugging to find working solutions. What should have been straightforward implementation became a process of researching current documentation, testing different approaches, and adapting outdated code examples to modern standards.

This experience highlights how educational materials in fast-moving fields like web development can become outdated quickly. Exercises written for Angular 17 don't work seamlessly with Angular 19, and npm package updates can break previously working code. Keeping learning materials current with the latest framework versions would save students significant debugging time.

### Technical Stack
- Angular 19 (standalone components)
- Angular Material 19 (Material Design 3)
- TypeScript
- SCSS styling
- RxJS for API calls

### File Structure
```
src/app/
├── user-registration-form/    # Sign up dialog
├── user-login-form/          # Login dialog
├── welcome-page/             # Main page
├── fetch-api-data.service.ts # API connection
└── app.component.ts          # Main app
```

### Current Features
- User registration with validation
- User login with error handling
- Form validation and user feedback
- Session storage in browser
- Responsive design for different screen sizes

### Planned Features
- Browse movies
- View movie details
- Save favorite movies
- Search and filter movies

## Troubleshooting

**App won't start**: Check that Node.js is version 18+
**Forms don't work**: Check browser console for errors
**Styling looks wrong**: Try refreshing the browser

## Development Setup

This code follows modern Angular patterns with standalone components. Each form is its own component that handles its own logic and styling. The API service manages all server communication.

The app structure makes it easy to add new features and maintain existing code.

---

Built with Angular 19 and Angular Material