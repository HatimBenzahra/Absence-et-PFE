import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles: Role[] = route.data?.['roles'];

  if (!expectedRoles || expectedRoles.length === 0) {
    return true; // No role restriction — allow any authenticated user
  }

  if (expectedRoles.some(role => authService.hasRole(role))) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
