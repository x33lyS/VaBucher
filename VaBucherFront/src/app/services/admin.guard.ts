import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const currentUser = this.authService.getCurrentUser();
      if (currentUser && (currentUser.role === 3|| currentUser.role === 4)  ) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
}
