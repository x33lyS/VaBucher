import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { EventEmitter, Input, Output } from '@angular/core';

import { JobofferService } from 'src/app/services/joboffer.service';

@Component({
  selector: 'app-joboffer',
  templateUrl: './joboffer.component.html',
  styleUrls: ['./joboffer.component.scss']
})
export class JobofferComponent implements OnInit {
  joboffers: JobOffer[] = [];

  constructor(private jobofferService: JobofferService) { }

  ngOnInit(): void {
    this.jobofferService
    .getJobOffer()
    .subscribe((result: JobOffer[])=> (this.joboffers = result));
  }
  
}

