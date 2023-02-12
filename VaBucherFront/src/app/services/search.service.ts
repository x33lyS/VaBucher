import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Search } from '../models/search';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url= "search";
  private apiUrl = "https://localhost:7059/api"


  constructor(private http: HttpClient) { }

  public getSearch() : Observable<Search[]> {
    return this.http.get<Search[]>(`${this.apiUrl}/${this.url}`);
  }

  public createSearch(search: Search): Observable<Search[]> {
    return this.http.post<Search[]>(
      `${this.apiUrl}/${this.url}`,
      search
    );
  }

  public updateSearch(search: Search): Observable<Search[]> {
    return this.http.put<Search[]>(
      `${this.apiUrl}/${this.url}/${search.id}`,
      search
    );
  }

  public deleteSearch(search: Search): Observable<Search[]> {
    return this.http.delete<Search[]>(
      `${this.apiUrl}/${this.url}/${search.id}`
    );
  }
}
