import { Component, EventEmitter, Input, Output } from '@angular/core';
import { interval, take } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { Search } from 'src/app/models/search';
import { JobType } from 'src/app/models/jobtype';
import { JobofferService } from 'src/app/services/joboffer.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiDataService } from "../../services/api-data.service";
import { SearchService } from 'src/app/services/search.service';
import { JobtypeService } from 'src/app/services/jobtype.service';
import { CurrentUser } from 'src/app/models/currentuser';
import { JobofferComponent } from '../joboffer/joboffer.component';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  domainFilter!: string;
  locationFilter!: string;
  jobtypefilter!: string;
  apiData: any[] = [];
  searches: Search[] = [];
  selectedJobTypes: any[] = [];
  filteredSearches: any[] = [];
  currentUser!: CurrentUser;
  currentUserData: string | null | undefined
  jobtypes: JobType[] = [];
  joboffers: JobOffer[] = [];



  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();
  @Output() filtersChanged = new EventEmitter<{ domain: string, location: string, jobtype: string }>();
  private token = 'qQXLAMeZBi0kgujYwkbGCuX4t_w';
  @Input() jobofferComponent!: JobofferComponent;

  constructor(private jobofferService: JobofferService,
    private http: HttpClient,
    private dataService: ApiDataService,
    private searchService: SearchService,
    private jobtypeService: JobtypeService) { }


  ngOnInit(): void {
    this.currentUserData = localStorage.getItem('currentUser');
    if (this.currentUserData) {
      this.currentUser = JSON.parse(this.currentUserData);
    }
    this.jobtypeService
      .getJobType()
      .subscribe((result: JobType[]) => (this.jobtypes = result));
    interval(5000).subscribe(() => this.searchService
      .getSearch()
      .subscribe((result: Search[]) => (this.searches = result)));

      this.searchService
      .getSearch()
      .subscribe((result: Search[]) => (this.searches = result));

    this.searchService.createnewrandom.subscribe(newrandom => {
      if (newrandom) {
        const { domain, jobType } = newrandom;
        this.domainFilter = domain.filter;
      }
    });
    this.ngAfterInitUserProfil();
  }

  ngAfterInitUserProfil() {
    if (this.currentUser) {
      if (this.currentUser.domain) {
        this.domainFilter = this.currentUser.domain.split(',')[0];

      }
      if (this.currentUser.location) {
        this.locationFilter = this.currentUser.location;
      }
    }
    this.filterOptions();
  }

  onSubmit() {
    const apiUrl = `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.domainFilter}&commune=${this.locationFilter}&origineOffre=0`;
    const joboffer = new JobOffer();
    if (this.domainFilter) {
      joboffer.domain = this.domainFilter.charAt(0).toUpperCase() + this.domainFilter.slice(1);
    }
    if (this.locationFilter) {
      joboffer.localisation = this.locationFilter.charAt(0).toUpperCase() + this.locationFilter.slice(1);
    }
    if (this.jobtypefilter) {
      joboffer.types = this.jobtypefilter;
    }
    this.jobofferService.createJobOffer(joboffer).subscribe((result: JobOffer[]) => this.jobOffersUpdated.emit(result));
    this.filterJobOffers();
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
    });
    // @ts-ignore
    this.http.get(`${apiUrl}`, { headers }).subscribe(({ resultats }) => {
      resultats.forEach((item: any) => {
        if (!this.apiData.find(x => x.id === item.id)) {
          this.apiData.push(item);
          this.dataService.updateData(this.apiData);
        }
      });
    });
  }

  updateSelectedJobTypes(jobType: any) {
    this.selectedJobTypes = jobType
    this.jobtypefilter = this.selectedJobTypes.join(',');
    this.filterJobOffers();
  }

  filterOptions() {
    if (this.domainFilter == undefined) {
      this.filteredSearches = this.searches;
      return;
    }
    const lowerCaseFilter = this.domainFilter.toLowerCase();
    this.filteredSearches = this.searches.filter(search =>
      search.filter.toLowerCase().includes(lowerCaseFilter)
    );
    this.filterJobOffers()
  }
  filterJobOffers() {
    this.filtersChanged.emit({ domain: this.domainFilter, location: this.locationFilter, jobtype: this.jobtypefilter });
  }
}
