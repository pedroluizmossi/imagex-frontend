import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { MainLayoutComponent } from './layouts/main/main.component'; // Importe o layout

export const routes: Routes = [
  // Rota de Login (pública, fora do layout principal)
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },

  // Rota de Layout Principal (protegida pelo guard)
  {
    path: 'app', // Prefixo para todas as rotas autenticadas
    component: MainLayoutComponent, // Usa nosso componente de layout
    canActivate: [authGuard],
    children: [ // As páginas são renderizadas DENTRO do outlet do layout
      {
        path: 'home', // Acessada via /app/home
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: '', // Rota padrão dentro do /app
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  },

  // Rota padrão do aplicativo
  {
    path: '',
    redirectTo: '/app/home', // Redireciona para a home dentro do layout
    pathMatch: 'full',
  },
];