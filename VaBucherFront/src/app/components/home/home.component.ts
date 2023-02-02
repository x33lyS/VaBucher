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
  currentUser!: CurrentUser;
  allDomains: string[] = [];
  allTypes: string[] = [];
  criteria: boolean = false;

  constructor(private jobofferService: JobofferService) { }

  ngOnInit(): void {
    this.getOffers();
  }

  getOffers(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
      this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
        this.joboffers = result;
        this.allDomains = [...new Set(this.joboffers.map(offer => offer.domain))];
        this.allTypes = [...new Set(this.joboffers.map(offer => offer.types))];
        if (this.currentUser.jobtype && this.currentUser.domain) {
          const currentUserDomains = this.currentUser.domain.split(',');
          const currentUserJobType = this.currentUser.jobtype;
          if (currentUserJobType && currentUserDomains) {
            const isDomainMatch = currentUserDomains.some(domain => this.allDomains.includes(domain));
            const isJobTypeMatch = this.allTypes.some(type => type.includes(currentUserJobType));
            console.log(isDomainMatch + " " + isJobTypeMatch);

            if (isDomainMatch && isJobTypeMatch) {
              this.joboffers = result.filter(offer => currentUserDomains.includes(offer.domain) && offer.types.includes(currentUserJobType));
              this.criteria = true;
              if (this.joboffers.length === 0) {
                this.joboffers = result;
              }
            }
          }
        } else if (this.currentUser.jobtype) {
          const currentUserJobType = this.currentUser.jobtype;
          this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
            this.joboffers = result.filter(joboffer => joboffer.types.includes(currentUserJobType));
            this.criteria = true;
          });
        } else if (this.currentUser.domain) {
          const currentUserDomains = this.currentUser.domain.split(',');
          this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
            this.joboffers = result.filter(joboffer => currentUserDomains.includes(joboffer.domain));
            this.criteria = true;
          });
        } else {
          this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
            this.joboffers = result;
          });

        }
      });
    } else {
      this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
        this.joboffers = result;
      });
    }
  }
}

