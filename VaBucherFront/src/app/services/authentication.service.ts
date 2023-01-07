import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs/operators';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<{ token: string }> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let basicAuthHeaderString = 'Basic' + window.btoa(user.email + ':' + user.password);
    headers = headers.set('Authorization', basicAuthHeaderString);

    return this.http.post<{ token: string }>(`${environment.apiUrl}/Auth/login`, {
      email: user.email,
      password: user.password
    }, {headers});

  }

public checkToken(){
    // let headers = new HttpHeaders().set('Content-Type', 'application/json');
    // headers = headers.set ('Authorization', 'Bearer ' + localStorage.getItem('token'));
    // return this.http.post(`${environment.apiUrl}/Auth/checkToken`, {headers}).pipe(map((res: any) => {
    //   return res;
    // }));
}
}
