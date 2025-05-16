import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const user = inject(UserService);
  const toast = inject(ToastService);
  const router = inject(Router);
  return user.getMyData().pipe(
    map((res) => {
      if (res) {
        if (res.isAdmin) return true;
        toast.error('You are not authorized to access this page', {
          title: 'Access Denied',
          showIcon: true,
        });
        return router.createUrlTree(['/']);
      }
      toast.error('You are not authorized', {
        title: 'Access Denied',
        showIcon: true,
      });
      return router.createUrlTree(['/login']);
    })
  );
};
