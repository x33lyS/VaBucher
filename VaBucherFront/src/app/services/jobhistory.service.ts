import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {JobOffer} from "../models/joboffer";
import {CurrentUser} from "../models/currentuser";
import {Jobhistory} from "../models/jobhistory";

@Injectable({
  providedIn: 'root'
})
export class JobhistoryService {
  private url= "JobHistory";
  private apiUrl = "https://localhost:7059/api"
  constructor(private http: HttpClient) { }

  public getJobOfferHistory() : Observable<Jobhistory[]> {
    return this.http.get<Jobhistory[]>(`${this.apiUrl}/${this.url}`);
  }

  public createJobOfferHistory(jobofferid: number | undefined, currentUserid: number): Observable<Jobhistory[]> {
    const payload = {
      idOffer: jobofferid,
      idUser: currentUserid
    };
    return this.http.post<Jobhistory[]>(`${this.apiUrl}/${this.url}`, payload);
  }
  public deleteJobOfferHistory(jobofferid: number | undefined, currentUserid: number): Observable<JobOffer[]> {
    return this.http.delete<JobOffer[]>(
      `${this.apiUrl}/${this.url}/${currentUserid}/${jobofferid}`
    );
  }

}
