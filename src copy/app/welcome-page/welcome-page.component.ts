import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {
  constructor(public dialog: MatDialog) { }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, { width: '400px' });
  }

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, { width: '400px' });
  }
}
