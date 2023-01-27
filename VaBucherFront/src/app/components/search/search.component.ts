import { Component, EventEmitter, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { Search } from 'src/app/models/search';
import { JobofferService } from 'src/app/services/joboffer.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiDataService} from "../../services/api-data.service";
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  domainFilter!: string;
  locationFilter!: string;
  salaryFilter!: string;
  apiData: any[] = [];
  searches: Search[] = [];
  searchInput!: string;


  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();
  @Output() filtersChanged = new EventEmitter<{domain: string, location: string, salary: string}>();
  private token = 'qQXLAMeZBi0kgujYwkbGCuX4t_w';

  constructor(private jobofferService: JobofferService,
              private http: HttpClient,
              private dataService: ApiDataService,
              private searchService: SearchService) { }


  ngOnInit(): void {
    interval(5000).subscribe(() => this.searchService
    .getSearch()
    .subscribe((result: Search[]) => (this.searches = result)));
  }

  onSubmit() {
    const apiUrl =  `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.domainFilter}&commune=${this.locationFilter}&origineOffre=0`;
    const joboffer = new JobOffer();
    if (this.domainFilter){
      joboffer.domain = this.domainFilter.charAt(0).toUpperCase() + this.domainFilter.slice(1);
    } else {
      joboffer.domain = this.searchInput;
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
    console.log(this.domainFilter, this.locationFilter, this.salaryFilter);
    
    this.filtersChanged.emit({domain: this.domainFilter, location: this.locationFilter, salary: this.salaryFilter});
  }
}
