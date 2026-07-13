import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Anexa o Access Token em toda requisição autenticada. Se a API responder
 * 401 (token expirado), tenta renovar via refresh token uma única vez;
 * se o refresh também falhar, desloga e redireciona para o login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  const authorizedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest = req.url.includes('/auth/');

      if (error.status === 401 && !isAuthRequest) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${authService.getAccessToken()}` },
            });
            return next(retriedReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            router.navigate(['/auth']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
