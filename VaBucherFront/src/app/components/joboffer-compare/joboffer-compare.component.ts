import { Component } from '@angular/core';
import { JobofferService } from 'src/app/services/joboffer.service';

@Component({
  selector: 'app-joboffer-compare',
  templateUrl: './joboffer-compare.component.html',
  styleUrls: ['./joboffer-compare.component.scss']
})
export class JobofferCompareComponent {
  jobofferService: JobofferService;
  savedJobOffers: any;

  constructor(jobofferService: JobofferService) {
    this.jobofferService = jobofferService;
  }

  ngOnInit(): void {
    this.savedJobOffers = this.jobofferService.getSavedJobOffers()
    console.log(this.savedJobOffers);
    
  }
}
