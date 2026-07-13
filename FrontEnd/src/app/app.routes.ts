import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { providerStatusGuard } from './core/guards/provider-status.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth-landing/auth-landing.component').then((m) => m.AuthLandingComponent),
  },
  {
    path: 'auth/client/login',
    loadComponent: () => import('./auth/client-login/client-login.component').then((m) => m.ClientLoginComponent),
  },
  {
    path: 'auth/client/register',
    loadComponent: () => import('./auth/client-register/client-register.component').then((m) => m.ClientRegisterComponent),
  },
  {
    path: 'auth/provider/login',
    loadComponent: () => import('./auth/provider-login/provider-login.component').then((m) => m.ProviderLoginComponent),
  },
  {
    path: 'auth/provider/register',
    loadComponent: () => import('./auth/provider-register/provider-register.component').then((m) => m.ProviderRegisterComponent),
  },
  {
    path: 'auth/provider/em-analise',
    loadComponent: () => import('./auth/status/em-analise.component').then((m) => m.EmAnaliseComponent),
  },
  {
    path: 'auth/provider/reprovado',
    loadComponent: () => import('./auth/status/reprovado.component').then((m) => m.ReprovadoComponent),
  },
  {
    path: 'auth/provider/cadastro-enviado',
    loadComponent: () => import('./auth/status/cadastro-enviado.component').then((m) => m.CadastroEnviadoComponent),
  },
  {
    path: 'dashboard/cliente',
    canActivate: [roleGuard],
    data: { role: 'cliente' },
    loadComponent: () =>
      import('./dashboard/client-dashboard/client-dashboard.component').then((m) => m.ClientDashboardComponent),
  },
  {
    path: 'dashboard/cliente/nova-solicitacao',
    canActivate: [roleGuard],
    data: { role: 'cliente' },
    loadComponent: () =>
      import('./dashboard/client-dashboard/new-request/new-request.component').then((m) => m.NewServiceRequestComponent),
  },
  {
    path: 'dashboard/prestador',
    canActivate: [roleGuard, providerStatusGuard],
    data: { role: 'prestador' },
    loadComponent: () =>
      import('./dashboard/provider-dashboard/provider-dashboard.component').then((m) => m.ProviderDashboardComponent),
  },
  { path: '**', redirectTo: '' },
];
