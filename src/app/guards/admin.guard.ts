import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/admin/login']);
    return false;
  }
};
