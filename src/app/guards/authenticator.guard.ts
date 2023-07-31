import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';


export const authGuard = () => {
  const authService = inject(UserService);
  const router = inject(Router);

  if (authService.userAuthenticated) {
    return true;
  }

  authService.authGuardAlert()
  return false;
};