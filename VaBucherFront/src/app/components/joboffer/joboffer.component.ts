import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { EventEmitter, Input, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobofferService } from 'src/app/services/joboffer.service';
import { FilterPipe } from 'src/app/filter.pipe';
import { ApiDataService } from "../../services/api-data.service";
import { CurrentUser } from 'src/app/models/currentuser';
import { JobtypeService } from 'src/app/services/jobtype.service';
import { JobType } from 'src/app/models/jobtype';
import { SearchService } from 'src/app/services/search.service';
import { Search } from 'src/app/models/search';



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
  currentUser!: CurrentUser;
  allDomains: string[] = [];
  allTypes: string[] = [];
  page = 1;
  pageSize = 6;
  currentPage = 1;
  pages = [1];
  jobtypes!: JobType[];
  searches!: Search[];
  selectedJobOffer: JobOffer | null = null;


  constructor(private jobofferService: JobofferService, private jobtypeService: JobtypeService, private searchService: SearchService, private dataService: ApiDataService, private filter: FilterPipe) { }

  ngOnInit(): void {
    interval(5000).subscribe(() => this.jobofferService
      .getJobOffer()
      .subscribe((result: JobOffer[]) => (this.joboffers = result)));
    this.dataService.currentData.subscribe(data => {
      this.data = data;
    });
    this.jobtypeService
      .getJobType()
      .subscribe((result: JobType[]) => (this.jobtypes = result));
    this.searchService.getSearch().subscribe((result: Search[]) => (this.searches = result));
    this.getOffers();
  }

  public closeJobOfferDetails() {
    this.selectedJobOffer = null;
  }
  setNumberPage(filteredJoboffers: JobOffer[]) {
    this.pages = [];
    for (let i = 1; i <= filteredJoboffers.length / 6; i++) {
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

  updateFilters(filters: { domain: string, location: string, jobtype: string }): void {
    this.domainFilter = filters.domain;
    this.locationFilter = filters.location;
    this.jobtypefilter = filters.jobtype;
    this.page = 1;
  }

  searchNewOffer() {
    const randomDomain = this.searches[Math.floor(Math.random() * this.searches.length)];
    const randomJobType = this.jobtypes[Math.floor(Math.random() * this.jobtypes.length)];

    this.searchService.setCreatednewrandom({ domain: randomDomain });

    this.updateFilters({
      domain: randomDomain.filter,
      location: "",
      jobtype: randomJobType.jobs
    });
  }


}

