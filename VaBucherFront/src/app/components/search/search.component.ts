import { Component, EventEmitter, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { Search } from 'src/app/models/search';
import { JobofferService } from 'src/app/services/joboffer.service';
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
  searches: Search[] = [];
  searchInput!: string;


  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();
  @Output() filtersChanged = new EventEmitter<{domain: string, location: string, salary: string}>();

  constructor(private jobofferService: JobofferService,private searchService: SearchService) { }

  ngOnInit(): void {
    interval(5000).subscribe(() => this.searchService
    .getSearch()
    .subscribe((result: Search[]) => (this.searches = result)));



  }

  onSubmit() {
    console.log(this.searches);

    const joboffer = new JobOffer();
    if (this.domainFilter){
      joboffer.domain = this.domainFilter.charAt(0).toUpperCase() + this.domainFilter.slice(1);
    } else {
      joboffer.domain = this.searchInput;
    }
    this.jobofferService.createJobOffer(joboffer).subscribe((result: JobOffer[]) => this.jobOffersUpdated.emit(result));
    this.filterJobOffers();

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
    this.filtersChanged.emit({domain: this.domainFilter, location: this.locationFilter, salary: this.salaryFilter});
  }
}
