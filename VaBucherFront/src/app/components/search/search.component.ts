import { Component, EventEmitter, Output } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { JobofferService } from 'src/app/services/joboffer.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  inputValue!: string;
  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();

  constructor(private jobofferService: JobofferService) { }
  onSubmit() {
    const joboffer = new JobOffer();
    this.jobofferService.createJobOffer(joboffer).subscribe((result: JobOffer[]) => this.jobOffersUpdated.emit(result));

  }
}