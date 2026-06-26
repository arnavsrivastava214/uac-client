import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginModalComponent } from "./login-modal.component";
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginModalComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'unstoppableAcademicClassess';

  constructor(public authService: AuthService) {}

  closeLoginModal() {
    this.authService.showLoginModal.set(false);
  }

}

