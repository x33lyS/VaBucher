import { Component } from '@angular/core';
import { JobofferService } from 'src/app/services/joboffer.service';
import {ToastrService} from "ngx-toastr";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-joboffer-compare',
  templateUrl: './joboffer-compare.component.html',
  styleUrls: ['./joboffer-compare.component.scss'],
  animations: [
    trigger('deleteAnimation', [
      state('deleted', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      transition('* => deleted', [
        animate('300ms ease-out')
      ])
    ])
  ]
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

  constructor(jobofferService: JobofferService, private toastr: ToastrService) {
    this.jobofferService = jobofferService;
  }

  ngOnInit(): void {
    this.savedJobOffers = this.jobofferService.getSavedJobOffers()}

  deleteCompare(jobOffer: any) {
    jobOffer.state = 'deleted';
    const savedJobOffers = JSON.parse(localStorage.getItem('savedForCompareJobOffers') || '[]');
    setTimeout(() => {
      const index = this.savedJobOffers.indexOf(jobOffer);
      this.savedJobOffers.splice(index, 1);
      localStorage.setItem('savedForCompareJobOffers', JSON.stringify(this.savedJobOffers));
      this.toastr.error('Offre supprimé')
    }, 300);
  }

  takeIndexSalary() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesSalary.includes(i)) {
        this.hoveredIndexesSalary.push(i);
      }
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
    }
  }

  takeIndexType() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesType.includes(i)) {
        this.hoveredIndexesType.push(i);
      }
    }
  }

  takeIndexCompanyInfo() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesCompanyInfo.includes(i)) {
        this.hoveredIndexesCompanyInfo.push(i);
      }
    }
  }

  takeIndexDomain() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesDomain.includes(i)) {
        this.hoveredIndexesDomain.push(i);
      }
    }
  }
  takeIndexDate() {
    const indexs = this.savedJobOffers.length;
    for (let i = 0; i < indexs; i++) {
      if (!this.hoveredIndexesDate.includes(i)) {
        this.hoveredIndexesDate.push(i);
      }
    }
  }
}
