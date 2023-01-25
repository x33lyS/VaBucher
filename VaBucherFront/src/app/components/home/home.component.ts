import { Component, OnInit } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { JobofferService } from 'src/app/services/joboffer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  joboffers: JobOffer[] = [];
  constructor(private jobofferService: JobofferService) { }

  ngOnInit(): void {
    this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
        this.joboffers = result.filter(joboffer => joboffer.domain === "professeur");
    });
}


}
