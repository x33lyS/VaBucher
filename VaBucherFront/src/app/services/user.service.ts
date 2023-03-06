import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {catchError, of, throwError} from "rxjs";
import { CurrentUser } from '../models/currentuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url= "user";
  private apiUrl = "https://localhost:7059/api"

  constructor(private http: HttpClient) { }

  public getUser() : Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${this.url}`);
  }
  // j'ai mis type any pour le moment car on ne renvoi pas l'id et le role pour update, l'user de devrait pas y avoir accès
  // voir si on fait les vérif en back
  public updateUser(user: any): Observable<User[]> {
    return this.http.put<User[]>(
      `${this.apiUrl}/${this.url}`,
      user
    );
  }
  public createUser(user: User): Observable<User[] | HttpErrorResponse> {
    return this.http.post<User[]>(
      `${this.apiUrl}/${this.url}`,
      user
    ).pipe(
      catchError((error: { status: number; error: { error: string; }; }) => {
        if (error.status === 400 && error.error.error === "Email already exists") {
          return of(new HttpErrorResponse({ error: "Un utilisateur avec cet e-mail existe déjà." }));
        } else {
          return throwError(error);
        }
      })
    );
  }


  public deleteUser(user: User): Observable<User[]> {
    return this.http.delete<User[]>(
      `${this.apiUrl}/${this.url}/${user.id}`
    );
  }
}
