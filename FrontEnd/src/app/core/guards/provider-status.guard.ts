import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege o dashboard do prestador: só passa se o status for APROVADO.
 * EM_ANALISE ou REPROVADO são redirecionados para a tela de status correspondente.
 */
export const providerStatusGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user || user.role !== 'prestador') {
    router.navigate(['/auth']);
    return false;
  }

  if (user.status === 'EM_ANALISE') {
    router.navigate(['/auth/provider/em-analise']);
    return false;
  }

  if (user.status === 'REPROVADO') {
    router.navigate(['/auth/provider/reprovado']);
    return false;
  }

  return true;
};
