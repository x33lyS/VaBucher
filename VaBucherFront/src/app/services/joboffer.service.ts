import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { JobOffer } from '../models/joboffer';

@Injectable({
  providedIn: 'root'
})
export class JobofferService {
  private url= "joboffer";


  constructor(private http: HttpClient) { }

  public getJobOffer() : Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${environment.apiUrl}/${this.url}`);
  }

  public deleteJobOffer(joboffer: JobOffer): Observable<JobOffer[]> {
    return this.http.delete<JobOffer[]>(
      `${environment.apiUrl}/${this.url}/${joboffer.id}`
    );
  }
}
