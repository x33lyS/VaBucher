import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { interval, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  currentUserData: string | null | undefined;
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      this.currentUserData = localStorage.getItem('currentUser');
    if (this.currentUserData) {
      this.router.navigate(['/profil']);
      return false;
    } else {
      return true;
    }
  }
}
