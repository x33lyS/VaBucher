import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  currentUserData: string | null | undefined;
  currentUser: any;
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      interval(100).subscribe(() => {
        this.currentUserData = localStorage.getItem('currentUser');
        if (this.currentUserData) {
          this.currentUser = JSON.parse(this.currentUserData);
        }
      }); 
      if (this.currentUser && this.currentUser.role === 3) {
        return true;
      } else {
        this.router.navigate(['/dashboard']);
        return false;
      }
  }
}
