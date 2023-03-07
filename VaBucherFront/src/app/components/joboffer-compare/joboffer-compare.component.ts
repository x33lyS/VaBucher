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
  hoveredIndexes: number[] = [];

  constructor(jobofferService: JobofferService) {
    this.jobofferService = jobofferService;
  }

  ngOnInit(): void {
    this.savedJobOffers = this.jobofferService.getSavedJobOffers()
    console.log(this.savedJobOffers);

  }
  deleteCompare(jobOffer: any) {
    const savedJobOffers = JSON.parse(localStorage.getItem('savedForCompareJobOffers') || '[]');
    const index = savedJobOffers.findIndex((savedJobOffer: any) => savedJobOffer.id === jobOffer.id);
    if (index > -1) {
      savedJobOffers.splice(index, 1);
      localStorage.setItem('savedForCompareJobOffers', JSON.stringify(savedJobOffers));
      this.savedJobOffers.splice(index, 1);
    }
  }

  takeIndex() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexes.includes(i)) {
        this.hoveredIndexes.push(i);
      }
      console.log(this.hoveredIndexes);
    }
  }
}
