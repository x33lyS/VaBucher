import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { EventEmitter, Input, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobofferService } from 'src/app/services/joboffer.service';
import { FilterPipe } from 'src/app/filter.pipe';



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


  constructor(private jobofferService: JobofferService) { }

  ngOnInit(): void {
    interval(5000).subscribe(() => this.jobofferService
      .getJobOffer()
      .subscribe((result: JobOffer[]) => (this.joboffers = result)));


  }
  updateFilters(filters: {domain: string, location: string, salary: string}): void {
    this.domainFilter = filters.domain;
    this.locationFilter = filters.location;
    this.salaryFilter = filters.salary;
  }

}

