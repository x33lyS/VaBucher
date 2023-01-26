import { Component, EventEmitter, Output } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { JobofferService } from 'src/app/services/joboffer.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  domainFilter!: string;
  locationFilter!: string;
  salaryFilter!: string;
  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();
  @Output() filtersChanged = new EventEmitter<{domain: string, location: string, salary: string}>();

  constructor(private jobofferService: JobofferService) { }
  onSubmit() {
    const joboffer = new JobOffer();
    joboffer.domain = this.domainFilter;
    this.jobofferService.createJobOffer(joboffer).subscribe((result: JobOffer[]) => this.jobOffersUpdated.emit(result));
    this.filterJobOffers();

  }

  filterJobOffers() {
    this.filtersChanged.emit({domain: this.domainFilter, location: this.locationFilter, salary: this.salaryFilter});
  }
}
