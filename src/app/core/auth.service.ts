import { Injectable, inject } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { WorkflowCacheService } from './workflow-cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject$ = new Subject<boolean>();
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
  private workflowCacheService = inject(WorkflowCacheService);

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
    
    const isAuthenticated = this.hasValidToken();
    this.isAuthenticatedSubject$.next(isAuthenticated);
    
    // Se o usuário estiver autenticado, carrega o último workflow utilizado
    if (isAuthenticated) {
      this.loadLastUsedWorkflow();
    }
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

  /**
   * Carrega o último workflow utilizado pelo usuário
   * Útil para exibir informações ou pré-selecionar workflows após o login
   */
  private loadLastUsedWorkflow(): void {
    const lastWorkflow = this.workflowCacheService.getLastWorkflow();
    if (lastWorkflow) {
      console.log('[AuthService] Último workflow do usuário:', lastWorkflow);
    }
  }

  /**
   * Obtém o último workflow selecionado pelo usuário
   */
  public getLastSelectedWorkflow() {
    return this.workflowCacheService.getLastWorkflow();
  }
}