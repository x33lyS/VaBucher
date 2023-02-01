import { Component, EventEmitter, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { Search } from 'src/app/models/search';
import { JobType } from 'src/app/models/jobtype';
import { JobofferService } from 'src/app/services/joboffer.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiDataService} from "../../services/api-data.service";
import { SearchService } from 'src/app/services/search.service';
import { JobtypeService } from 'src/app/services/jobtype.service';



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
  selectedJobTypes: any[]= [];
  filteredSearches:any[] = [];

  jobtypes: JobType[] = [];


  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();
  @Output() filtersChanged = new EventEmitter<{domain: string, location: string, jobtype: string}>();
  private token = 'qQXLAMeZBi0kgujYwkbGCuX4t_w';

  constructor(private jobofferService: JobofferService,
              private http: HttpClient,
              private dataService: ApiDataService,
              private searchService: SearchService,
              private jobtypeService: JobtypeService) { }


  ngOnInit(): void {
    interval(5000).subscribe(() => this.searchService
    .getSearch()
    .subscribe((result: Search[]) => (this.searches = result)));
   this.jobtypeService
    .getJobType()
    .subscribe((result: JobType[]) => (this.jobtypes = result));
  }

  onSubmit() {
    const apiUrl =  `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.domainFilter}&commune=${this.locationFilter}&origineOffre=0`;
    const joboffer = new JobOffer();
      joboffer.domain = this.domainFilter.charAt(0).toUpperCase() + this.domainFilter.slice(1);
    this.jobofferService.createJobOffer(joboffer).subscribe((result: JobOffer[]) => this.jobOffersUpdated.emit(result));
    this.filterJobOffers();
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
    });
    // @ts-ignore
    this.http.get(`${apiUrl}`, { headers }).subscribe(({resultats}) => {
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
    console.log(this.selectedJobTypes);
    this.jobtypefilter = this.selectedJobTypes.join(',');
    console.log(1);
    this.filterJobOffers();
  }
  filterOptions() {
    if (!this.domainFilter) {
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
    this.filtersChanged.emit({domain: this.domainFilter, location: this.locationFilter, jobtype: this.jobtypefilter});
  }
}
