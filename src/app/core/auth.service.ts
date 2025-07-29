import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_NkbijYkZT',
  redirectUri: window.location.origin,
  clientId: '4u0u5q0rb5cdhvrsf9a0mbvo3j',
  scope: 'openid profile email',
  responseType: 'code',
  dummyClientSecret: undefined,
  strictDiscoveryDocumentValidation: false,
  useSilentRefresh: true,
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject$ = new Subject<boolean>();
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  constructor(private oauthService: OAuthService) {}

  public async initializeLogin(): Promise<void> {
    this.oauthService.configure(authCodeFlowConfig);

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