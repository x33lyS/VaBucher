import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { JobType } from '../models/jobtype';
import {Search} from "../models/search";

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
  public createJobType(jobtype: JobType): Observable<JobType[]> {
    return this.http.post<JobType[]>(
      `${this.apiUrl}/${this.url}`,
      jobtype
    );
  }

  public updateJobType(jobtype: JobType): Observable<JobType[]> {
    return this.http.put<JobType[]>(
      `${this.apiUrl}/${this.url}/${jobtype.id}`,
      jobtype
    );
  }

  public deleteJobType(jobtype: JobType): Observable<JobType[]> {
    return this.http.delete<JobType[]>(
      `${this.apiUrl}/${this.url}/${jobtype.id}`
    );
  }

}

