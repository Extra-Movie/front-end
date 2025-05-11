import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();
  if (!isLoggedIn) {
    // Redirect to the login page and show an error message
    toast.error('You must be logged in to access this page.', {
      title: 'Access Denied',
      duration: 3000,
      showIcon: true,
    });
    router.navigate(['/login']);
    return false;
  }
  return true;
};
