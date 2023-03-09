import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { JobOffer } from '../models/joboffer';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class JobofferService {
  private url= "joboffer";
  private apiUrl = "https://localhost:7059/api"
  savedJobOffers: any[] = [];


  constructor(private http: HttpClient, private toastr: ToastrService) { }


  saveJobOffer(jobOffer: JobOffer) {
    const savedJobOffers = this.getSavedJobOffers();
    const jobOfferIndex = savedJobOffers.findIndex((o: { id: number | undefined; }) => o.id === jobOffer.id);
    if (jobOfferIndex === -1) {
      savedJobOffers.push(jobOffer);
      localStorage.setItem('savedForCompareJobOffers', JSON.stringify(savedJobOffers));
      this.toastr.success('Offre prête à être comparée');
    }else{
      this.toastr.error('Offre déjà enregistrée');
    }
  }

  getSavedJobOffers() {
  // @ts-ignore
    return localStorage.getItem('savedForCompareJobOffers') ? JSON.parse(localStorage.getItem('savedForCompareJobOffers')) : [];
}



  public getJobOffer() : Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/${this.url}`);
  }
  public getJobOfferById(jobOfferId: number | undefined): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${this.url}/${jobOfferId}`);
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
