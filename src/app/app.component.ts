import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonApp, 
  IonRouterOutlet, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel
  ],
})
export class AppComponent {
  constructor(public authService: AuthService) {
    addIcons({ logInOutline, logOutOutline });
  }

  get username(): string {
    const claims = this.authService.identityClaims;
    return claims ? claims['name'] || claims['email'] : 'Usuário';
  }
}