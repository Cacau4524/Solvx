import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.models';

/**
 * Uso: { path: 'dashboard/cliente', canActivate: [roleGuard], data: { role: 'cliente' } }
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as UserRole | undefined;

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth']);
    return false;
  }

  if (requiredRole && authService.currentUser()?.role !== requiredRole) {
    router.navigate(['/auth']);
    return false;
  }

  return true;
};
