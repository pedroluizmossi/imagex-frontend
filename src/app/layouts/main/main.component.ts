import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonButtons, IonMenuButton, IonButton, IonFooter, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, folderOutline, logOutOutline, settingsOutline, personOutline, chevronDownCircle, document, colorPalette, globe, chevronForwardCircle, chevronUpCircle } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonButton, IonFooter
  ],
})
export class MainLayoutComponent {

  constructor(public authService: AuthService) {
    addIcons({personOutline,logOutOutline,chevronForwardCircle,document,colorPalette,globe,chevronDownCircle,chevronUpCircle,homeOutline,folderOutline,settingsOutline});
  }

  get username(): string {
    const claims = this.authService.identityClaims;
    const nameFromEmail = this.userEmail.split('@')[0];
    return claims ? claims['name'] || nameFromEmail : nameFromEmail;
  }

  get userEmail(): string {
    const claims = this.authService.identityClaims;
    return claims ? claims['email'] : '';
  }
}