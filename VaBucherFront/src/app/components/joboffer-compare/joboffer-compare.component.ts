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
  hoveredIndexesSalary: number[] = [];
  hoveredIndexesLocation: number[] = [];
  hoveredIndexesType: number[] = [];
  hoveredIndexesCompanyInfo: number[] = [];
  hoveredIndexesDomain: number[] = [];
  hoveredIndexesDate: number[] = [];

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

  takeIndexSalary() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesSalary.includes(i)) {
        this.hoveredIndexesSalary.push(i);
      }
      console.log(this.hoveredIndexesSalary);
    }
  }
  leaveIndex() {
    this.hoveredIndexesSalary = [];
    this.hoveredIndexesLocation = [];
    this.hoveredIndexesType = [];
    this.hoveredIndexesCompanyInfo = [];
    this.hoveredIndexesDomain = [];
    this.hoveredIndexesDate = [];
  }

  takeIndexLocation() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesLocation.includes(i)) {
        this.hoveredIndexesLocation.push(i);
      }
      console.log(this.hoveredIndexesLocation);
    }
  }

  takeIndexType() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesType.includes(i)) {
        this.hoveredIndexesType.push(i);
      }
      console.log(this.hoveredIndexesType);
    }
  }

  takeIndexCompanyInfo() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesCompanyInfo.includes(i)) {
        this.hoveredIndexesCompanyInfo.push(i);
      }
      console.log(this.hoveredIndexesCompanyInfo);
    }
  }

  takeIndexDomain() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesDomain.includes(i)) {
        this.hoveredIndexesDomain.push(i);
      }
      console.log(this.hoveredIndexesDomain);
    }
  }
  takeIndexDate() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesDate.includes(i)) {
        this.hoveredIndexesDate.push(i);
      }
      console.log(this.hoveredIndexesDate);
    }
  }
}
