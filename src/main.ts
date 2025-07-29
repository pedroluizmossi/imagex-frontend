import { enableProdMode, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AuthService } from './app/core/auth.service';

if (environment.production) {
  enableProdMode();
}

/**
 * Initialize the authentication service before the app starts
 */
export function initializeAuth(authService: AuthService) {
  return (): Promise<any> => {
    return authService.initializeLogin();
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(OAuthModule.forRoot()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
});