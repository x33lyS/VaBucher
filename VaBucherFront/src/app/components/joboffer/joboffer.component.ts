import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { EventEmitter, Input, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobofferService } from 'src/app/services/joboffer.service';
import { FilterPipe } from 'src/app/filter.pipe';
import {ApiDataService} from "../../services/api-data.service";
import { CurrentUser } from 'src/app/models/currentuser';



@Component({
  selector: 'app-joboffer',
  templateUrl: './joboffer.component.html',
  styleUrls: ['./joboffer.component.scss'],
  providers: [FilterPipe]
})
export class JobofferComponent implements OnInit {
  joboffers: JobOffer[] = [];
  domainFilter!: string;
  locationFilter!: string;
  jobtypefilter!: string;
  filters: any = {};
  data: any[] = [];
  selectedJoboffer: any;
  currentUser!: CurrentUser;
  allDomains: string[] = [];
  allTypes: string[] = [];
  selectedJobOffer!: JobOffer;

  constructor(private jobofferService: JobofferService, private dataService: ApiDataService) { }

  ngOnInit(): void {
    // interval(5000).subscribe(() => this.jobofferService
    //   .getJobOffer()
    //   .subscribe((result: JobOffer[]) => (this.joboffers = result)));
    this.dataService.currentData.subscribe(data => {
      this.data = data;
    });
    this.getOffers();
  }
  getOffers() {
    this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
      this.joboffers = result      
    });

  }
  showDetails(joboffer: JobOffer) {
    this.selectedJobOffer = joboffer;
  }

  updateFilters(filters: {domain: string, location: string, jobtype: string}): void {
    this.domainFilter = filters.domain;
    this.locationFilter = filters.location;
    this.jobtypefilter = filters.jobtype;
  }

}

