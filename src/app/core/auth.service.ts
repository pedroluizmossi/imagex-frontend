import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject$ = new Subject<boolean>();
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private get authConfig(): AuthConfig {
    return {
      issuer: environment.auth.issuer,
      redirectUri: window.location.origin,
      clientId: environment.auth.clientId,
      scope: environment.auth.scope,
      responseType: environment.auth.responseType,
      dummyClientSecret: undefined,
      strictDiscoveryDocumentValidation: environment.auth.strictDiscoveryDocumentValidation,
      useSilentRefresh: environment.auth.useSilentRefresh,
    };
  }

  constructor(private oauthService: OAuthService) {}

  public async initializeLogin(): Promise<void> {
    this.oauthService.configure(this.authConfig);
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.isAuthenticatedSubject$.next(this.hasValidToken());
  }

  public login(): void {
    this.oauthService.initCodeFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
  }

  public hasValidToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public get identityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }
}