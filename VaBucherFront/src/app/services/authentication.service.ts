import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from "../models/user";
import { CurrentUser } from '../models/currentuser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = "https://localhost:7059/api"
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}


  public setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }
  public removeCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
  public getCurrentUser(): any {
    return this.currentUserSubject.getValue();
  }

  login(user: User): Observable<{ token: string, currentUser: string }> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let basicAuthHeaderString = 'Basic' + window.btoa(user.email + ':' + user.password);
    headers = headers.set('Authorization', basicAuthHeaderString);

    return this.http.post<{ token: string, currentUser: string }>(`${this.apiUrl}/Auth/login`, {
      email: user.email,
      password: user.password
    }, { headers });

  }

  public logout() {
    localStorage.removeItem('access_token');
    this.removeCurrentUser();
  }

  public checkToken() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let basic = localStorage.getItem('access_token');
    if (basic) {
      headers = headers.set('Authorization', basic);
      this.http.post(`${this.apiUrl}/Auth/verifyToken`, { headers })
        .pipe(tap((userData: any) => {
          console.log(userData);
        }));
    }
  }
}
