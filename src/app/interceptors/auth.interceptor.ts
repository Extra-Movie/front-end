import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const { token } = inject(AuthService);
  const authToken = token() ?? null;
  const cloned = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authToken}`),
  });
  return next(cloned);
};
