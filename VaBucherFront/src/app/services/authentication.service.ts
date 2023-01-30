import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = "https://localhost:7059/api"

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<{ token: string }> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let basicAuthHeaderString = 'Basic' + window.btoa(user.email + ':' + user.password);
    headers = headers.set('Authorization', basicAuthHeaderString);

    return this.http.post<{ token: string }>(`${this.apiUrl}/Auth/login`, {
      email: user.email,
      password: user.password
    }, {headers});

  }

  public logout() {
    localStorage.removeItem('access_token');
  }

  public checkToken() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let basic = localStorage.getItem('access_token');
    if (basic) {
      headers = headers.set('Authorization', basic);
      this.http.post(`${this.apiUrl}/Auth/verifyToken`, {headers})
        .pipe(tap((userData: any) => {
          console.log(userData);
        }));
    }
  }
}
