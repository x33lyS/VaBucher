import { HttpClient } from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { JobOffer } from '../models/joboffer';
import {ToastrService} from "ngx-toastr";
import {BehaviorSubject} from "rxjs";
import { JobhistoryService } from './jobhistory.service';
import {AuthenticationService} from "./authentication.service";
import {CurrentUser} from "../models/currentuser";
@Injectable({
  providedIn: 'root'
})
export class JobofferService {
  private url= "joboffer";
  private apiUrl = "https://localhost:7059/api"
  savedJobOffers: any[] = [];
  private searchResultObservable = new BehaviorSubject<any>([]);
  searchResult$ = this.searchResultObservable.asObservable();
  private pagesObservable = new BehaviorSubject<any>([]);
  pages$ = this.pagesObservable.asObservable();
  private currentPageObservable = new BehaviorSubject<any>('');
  currentPage$ = this.currentPageObservable.asObservable();
  currentUser: CurrentUser | any;

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


  saveHistory(joboffer: JobOffer) {
    // @ts-ignore
    this.userAuthenticate.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser || this.userAuthenticate.getCurrentUser();
      console.log('current user', this.currentUser)
    });
    const currentUserId = this.currentUser?.id;
    const currentJobOfferId = joboffer.id;
    const updatedJobOffer = {...joboffer, isSaved: true};
    console.log('Creating job history for user', currentUserId, 'and job offer', currentJobOfferId);

    this.getJobOfferById(currentJobOfferId).subscribe(
      jobOffer => {
        if (jobOffer.isSaved) {
          this.jobHistoryService.deleteJobOfferHistory(currentJobOfferId, currentUserId).subscribe(
            jobHistoryList => {
              console.log('Job history deleted successfully:', currentUserId);
              this.updateJobOfferAndSetIsSavedFalse(joboffer);
              this.toastr.success('Offre d\'emploi supprimée de vos favoris', 'Success', {
                positionClass: 'toast-top-left',
              });
              joboffer.isSaved = false;

            },
            error => {
              console.error('Error deleting job history:', error);
            }
          );
        } else {
          this.jobHistoryService.createJobOfferHistory(currentJobOfferId, currentUserId).subscribe(
            jobHistoryList => {
              this.toastr.success('Offre ajoutée à vos favoris', 'Success', {
                positionClass: 'toast-top-left',
              });
              joboffer.isSaved = true;
              this.updateJobOffer(updatedJobOffer).subscribe(
                updatedJobOfferList => {
                  console.log('Job offer updated successfully:', updatedJobOfferList);
                },
                error => {
                  console.error('Error updating job offer:', error);
                }
              );
              console.log('Job history created successfully:', jobHistoryList);
            },
            error => {
              console.error('Error creating job history:', error);
            }
          );
        }
      }
    );
  }

  updateJobOfferAndSetIsSavedFalse(joboffer: JobOffer) {
    joboffer.isSaved = false;
    this.updateJobOffer(joboffer).subscribe(
      updatedJobOfferList => {
        console.log('Job offer updated successfully:', updatedJobOfferList);
      },
      error => {
        console.error('Error updating job offer:', error);
      }
    );
  }
}
