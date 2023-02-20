import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { JobOffer } from '../models/joboffer';

@Injectable({
  providedIn: 'root'
})
export class JobofferService {
  private url= "joboffer";
  private apiUrl = "https://localhost:7059/api"
  savedJobOffers: any[] = [];



  constructor(private http: HttpClient) { }


  saveJobOffer(jobOffer: JobOffer) {
    const savedJobOffers = this.getSavedJobOffers();
    const jobOfferIndex = savedJobOffers.findIndex(o => o.id === jobOffer.id);
    if (jobOfferIndex === -1) {
      savedJobOffers.push(jobOffer);
    }
  }
  
  getSavedJobOffers() {
  return this.savedJobOffers;
}



  public getJobOffer() : Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/${this.url}`);
  }

  

  public createJobOffer(joboffer: JobOffer): Observable<JobOffer[]> {
    return this.http.post<JobOffer[]>(
      `${this.apiUrl}/${this.url}`,
      joboffer
    );
  }

  public updateJobOffer(joboffer: JobOffer): Observable<JobOffer[]> {
    return this.http.put<JobOffer[]>(
      `${this.apiUrl}/${this.url}/${joboffer.id}`,
      joboffer
    );
  }


  public deleteJobOffer(joboffer: JobOffer): Observable<JobOffer[]> {
    return this.http.delete<JobOffer[]>(
      `${this.apiUrl}/${this.url}/${joboffer.id}`
    );
  }
}
