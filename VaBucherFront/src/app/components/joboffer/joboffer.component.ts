import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { EventEmitter, Input, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobofferService } from 'src/app/services/joboffer.service';
import { FilterPipe } from 'src/app/filter.pipe';
import {ApiDataService} from "../../services/api-data.service";



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
  salaryFilter!: string;
  filters: any = {};
  data: any[] = [];

  constructor(private jobofferService: JobofferService, private dataService: ApiDataService) { }

  ngOnInit(): void {
    // interval(5000).subscribe(() => this.jobofferService
    //   .getJobOffer()
    //   .subscribe((result: JobOffer[]) => (this.joboffers = result)));
    console.log(this.data);
    this.dataService.currentData.subscribe(data => {
      this.data = data;
      console.log(data, '1')
    });

  }
  updateFilters(filters: {domain: string, location: string, salary: string}): void {
    this.domainFilter = filters.domain;
    this.locationFilter = filters.location;
    this.salaryFilter = filters.salary;
  }

}

