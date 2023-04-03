import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  private dataSource = new BehaviorSubject([]);
  private filterPoleEmploiDomainSubject = new BehaviorSubject<string>('');
  private filterPoleEmploiLocationSubject = new BehaviorSubject<string>('');
  private filterPoleEmploiJobTypeSubject = new BehaviorSubject([]);
  currentData = this.dataSource.asObservable();
  filterPoleEmploiDomain$ = this.filterPoleEmploiDomainSubject.asObservable();
  filterPoleEmploiLocation$ = this.filterPoleEmploiLocationSubject.asObservable();
  filterPoleEmploiJobType$ = this.filterPoleEmploiJobTypeSubject.asObservable();

  constructor() { }

  updateData(data: any) {
    this.dataSource.next(data);
  }
  setFilterPoleEmploiDomain(domain: string) {
    this.filterPoleEmploiDomainSubject.next(domain);
  }
  setFilterPoleEmploiLocation(location: string) {
    this.filterPoleEmploiLocationSubject.next(location);
  }
  setFilterPoleEmploiJobType(jobtype: []) {
    this.filterPoleEmploiJobTypeSubject.next(jobtype);
  }
}
