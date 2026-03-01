import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError(error => {
      switch (error.status) {
        case 401:
          authService.logout();
          router.navigate(['/login']);
          notification.error('Session expirée. Veuillez vous reconnecter.');
          break;
        case 403:
          notification.error('Accès interdit. Vous n\'avez pas les droits nécessaires.');
          break;
        case 404:
          // Do not show toast for 404 — let component handle it
          break;
        case 500:
          notification.error('Erreur serveur. Veuillez réessayer plus tard.');
          break;
        case 0:
          notification.error('Impossible de contacter le serveur. Vérifiez votre connexion.');
          break;
        default:
          if (error.status >= 400) {
            const message = error.error?.message || 'Une erreur est survenue.';
            notification.error(message);
          }
      }
      return throwError(() => error);
    })
  );
};
