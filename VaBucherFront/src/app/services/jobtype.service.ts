import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { JobType } from '../models/jobtype';

@Injectable({
  providedIn: 'root'
})
export class JobtypeService {
  private url= "jobtype";
  private apiUrl = "https://localhost:7059/api"

  constructor(private http: HttpClient) { }
  public getJobType() : Observable<JobType[]> {
    return this.http.get<JobType[]>(`${this.apiUrl}/${this.url}`);
  }

}

