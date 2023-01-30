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
  searchInput!: string;
  jobtypes: JobType[] = [];


  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();
  @Output() filtersChanged = new EventEmitter<{domain: string, location: string, salary: string}>();
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
    interval(5000).subscribe(() => this.jobtypeService
    .getJobType()
    .subscribe((result: JobType[]) => (this.jobtypes = result)));
  }

  onSubmit() {
    const apiUrl =  `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.domainFilter}&commune=${this.locationFilter}&origineOffre=0`;
    const joboffer = new JobOffer();
    if (this.domainFilter){
      joboffer.domain = this.domainFilter
    } else {
      joboffer.domain = this.searchInput.charAt(0).toUpperCase() + this.searchInput.slice(1);
    }    
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
  compareFn(value1: any, value2: any): boolean {
    return value1 === value2;
  }
  filterSearches() {
    this.searches = this.searches.filter(search =>
      search.filter.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }


  filterJobOffers() {    
    this.filtersChanged.emit({domain: this.domainFilter, location: this.locationFilter, salary: this.jobtypefilter});
  }
}
