import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { EventEmitter, Input, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobofferService } from 'src/app/services/joboffer.service';
import { FilterPipe } from 'src/app/filter.pipe';
import {ApiDataService} from "../../services/api-data.service";
import { CurrentUser } from 'src/app/models/currentuser';



@Component({
  selector: 'app-joboffer',
  templateUrl: './joboffer.component.html',
  styleUrls: ['./joboffer.component.scss'],
  providers: [FilterPipe]
})
export class JobofferComponent implements OnInit {
  joboffers: JobOffer[] = [];
  domainFilter!: string;
  locationFilter!: string;
  jobtypefilter!: string;
  filters: any = {};
  data: any[] = [];
  selectedJoboffer: any;
  currentUser!: CurrentUser;
  allDomains: string[] = [];
  allTypes: string[] = [];
  selectedJobOffer!: JobOffer;
  page = 1;
  pageSize = 6;
  currentPage = 1;
  pages = [1];


  constructor(private jobofferService: JobofferService, private dataService: ApiDataService,private filter: FilterPipe) { }

  ngOnInit(): void {
     interval(5000).subscribe(() => this.jobofferService
       .getJobOffer()
       .subscribe((result: JobOffer[]) => (this.joboffers = result)));
    this.dataService.currentData.subscribe(data => {
      this.data = data;
    });
    this.getOffers();
  }

  setNumberPage(filteredJoboffers: JobOffer[]) {
    this.pages = [];
    for (let i = 1; i <= filteredJoboffers.length /6; i++) {
      this.pages.push(i);
    }
  }

  getOffers() {
    this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
      this.joboffers = result
    });

  }

  get joboffersToDisplay(): JobOffer[] {
    let filteredJoboffers = this.joboffers;
    filteredJoboffers = this.filter.transform(filteredJoboffers, this.domainFilter, this.locationFilter, this.jobtypefilter);
    this.setNumberPage(filteredJoboffers);
    return filteredJoboffers.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.page = page;
  }
  showDetails(joboffer: JobOffer) {
    this.selectedJobOffer = joboffer;
  }

  updateFilters(filters: {domain: string, location: string, jobtype: string}): void {
    this.domainFilter = filters.domain;
    this.locationFilter = filters.location;
    this.jobtypefilter = filters.jobtype;
    this.page = 1;
  }

}

