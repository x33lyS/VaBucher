import { Component, OnInit } from '@angular/core';
import { CurrentUser } from 'src/app/models/currentuser';
import { JobOffer } from 'src/app/models/joboffer';
import { JobofferService } from 'src/app/services/joboffer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  joboffers: JobOffer[] = [];
  currentUser: CurrentUser | undefined;

  constructor(private jobofferService: JobofferService) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (this.currentUser?.search) {
        this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
          this.joboffers = result.filter(joboffer => joboffer.domain === this.currentUser?.search);
        });
      }
    } else {
      this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
        this.joboffers = result;
      });
    }

  }


}
