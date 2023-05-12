import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { JobOffer } from '../models/joboffer';
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { JobhistoryService } from './jobhistory.service';
import { AuthenticationService } from "./authentication.service";
import { CurrentUser } from "../models/currentuser";
@Injectable({
  providedIn: 'root'
})
export class JobofferService {
  private url = "joboffer";
  private apiUrl = "https://localhost:7059/api"
  savedJobOffers: any[] = [];
  private searchResultObservable = new BehaviorSubject<any>([]);
  searchResult$ = this.searchResultObservable.asObservable();
  private pagesObservable = new BehaviorSubject<any>([]);
  pages$ = this.pagesObservable.asObservable();
  private currentPageObservable = new BehaviorSubject<any>('');
  currentPage$ = this.currentPageObservable.asObservable();
  currentUser: CurrentUser | any;
  favoriteJobOffers: any;
  userFavoriteJobOffers: any;

  constructor(private http: HttpClient, private toastr: ToastrService,
    private jobHistoryService: JobhistoryService, private userAuthenticate: AuthenticationService) { }


  saveJobOffer(jobOffer: JobOffer) {
    const savedJobOffers = this.getSavedJobOffers();
    const jobOfferIndex = savedJobOffers.findIndex((o: { id: number | undefined; }) => o.id === jobOffer.id);
    if (jobOfferIndex === -1) {
      savedJobOffers.push(jobOffer);
      localStorage.setItem('savedForCompareJobOffers', JSON.stringify(savedJobOffers));
      this.toastr.success('Offre prête à être comparée', 'Success', {
        positionClass: 'toast-top-left',
      });
    } else {
      this.toastr.error('Offre déjà enregistrée', 'Error', {
        positionClass: 'toast-top-left',
      });
    }
  }

  getSavedJobOffers() {
    // @ts-ignore
    return localStorage.getItem('savedForCompareJobOffers') ? JSON.parse(localStorage.getItem('savedForCompareJobOffers')) : [];
  }

  public setPages(pages: any) {
    this.pagesObservable.next(pages);
    // this.sendPages.emit(pages);
  }

  public setCurrentPage(cPage: number) {
    this.currentPageObservable.next(cPage);
  }

  public getOffersAfterSearch(offers: JobOffer[]) {
    this.searchResultObservable.next(offers);
  }

  public getJobOffer(): Observable<JobOffer[]> {
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


  saveHistory(joboffer: JobOffer) {
    // @ts-ignore
    this.userAuthenticate.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser || this.userAuthenticate.getCurrentUser();
    });
    const currentUserId = this.currentUser?.id;
    const currentJobOfferId = joboffer.id;

    this.jobHistoryService.createJobOfferHistory(currentJobOfferId, currentUserId).subscribe(
      jobHistoryList => {
      });
  }
}
