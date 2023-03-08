import { Component, OnInit } from '@angular/core';
import { CurrentUser } from 'src/app/models/currentuser';
import { JobOffer } from 'src/app/models/joboffer';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { JobofferService } from 'src/app/services/joboffer.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  joboffers: JobOffer[] = [];
  allDomains: string[] = [];
  allTypes: string[] = [];
  criteria: boolean = false;
  selectedJobOffer: JobOffer | null = null;
  currentPage = 1;
  pages = [1];
  currentUser: CurrentUser | null = null;


  constructor(public jobofferService: JobofferService, private authentificationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    // this.getOffers();
      this.getOffers();
    this.authentificationService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser || this.authentificationService.getCurrentUser();
      // Si currentUser est null, on appelle getCurrentUser() pour chercher l'utilisateur dans le sessionStorage
    });
  }

  openSavedJobOffers() {
    const savedJobOffers = this.jobofferService.getSavedJobOffers();
    this.router.navigate(['/compare'], { state: { savedJobOffers } });
  }
  showDetails(joboffer: JobOffer) {
    this.selectedJobOffer = joboffer;
  }

  public closeJobOfferDetails() {
    this.selectedJobOffer = null;
  }
  setPage(page: number) {
    this.currentPage = page;
    // Mettre à jour les offres à afficher en fonction de la page actuelle
  }

  setNumberPage() {
    this.pages = [];
    for (let i = 1; i <= Math.min(this.joboffers.length / 4, 3); i++) {
      this.pages.push(i);
    }
  }

  getOffers() {
    const currentUser = this.authentificationService.getCurrentUser();
    this.currentUser = currentUser;
    if (currentUser) {
      this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
        this.joboffers = result;
        this.allDomains = [...new Set(this.joboffers.map(offer => offer.domain))];
        this.allTypes = [...new Set(this.joboffers.map(offer => offer.types))];
        if (currentUser.jobtype && currentUser.domain) {
          const currentUserDomains = currentUser.domain.split(',');
          const currentUserJobType = currentUser.jobtype;
          if (currentUserJobType && currentUserDomains) {
            const isDomainMatch = currentUserDomains.some(domain => this.allDomains.includes(domain));
            const isJobTypeMatch = this.allTypes.some(type => type.includes(currentUserJobType));
            if (isDomainMatch && isJobTypeMatch) {
              this.joboffers = result.filter(offer => currentUserDomains.includes(offer.domain) && offer.types.includes(currentUserJobType));
              this.criteria = true;
              if (this.joboffers.length < 4) {
                this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
                  let jobOfferArray = this.joboffers.concat(result);
                  this.joboffers = jobOfferArray.filter((value, index, self) => self.findIndex((t) => { return t.id === value.id }) === index);

                });
              }
              if (this.joboffers.length === 0) {
                this.joboffers = result;

              }
            }
          }
        } else if (currentUser.jobtype) {
          const currentUserJobType = currentUser.jobtype;
          this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
            this.joboffers = result.filter(joboffer => joboffer.types.includes(currentUserJobType));
            this.criteria = true;
            if (this.joboffers.length < 4) {
              this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
                let jobOfferArray = this.joboffers.concat(result);
                this.joboffers = jobOfferArray.filter((value, index, self) => self.findIndex((t) => { return t.id === value.id }) === index);
              });
            }

          });
        } else if (currentUser.domain) {
          const currentUserDomains = currentUser.domain.split(',');
          this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
            this.joboffers = result.filter(joboffer => currentUserDomains.includes(joboffer.domain));
            this.criteria = true;
            if (this.joboffers.length < 4) {
              this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
                let jobOfferArray = this.joboffers.concat(result);
                this.joboffers = jobOfferArray.filter((value, index, self) => self.findIndex((t) => { return t.id === value.id }) === index);
              });
            }
          });
        } else {
          this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
            this.joboffers = result;
          });
        }
        this.setNumberPage();
      });
    } else {
      this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
        this.joboffers = result;
        this.setNumberPage();
      });
    }
    return this.joboffers
  }
}


