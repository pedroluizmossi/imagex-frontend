import { Component } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton],
})
export class LoginPage {

  constructor(private authService: AuthService) { }

  login(): void {
    this.authService.login();
  }
}