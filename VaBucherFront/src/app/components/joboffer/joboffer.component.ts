import {Component, OnInit} from '@angular/core';
import {JobOffer} from 'src/app/models/joboffer';
import {interval, timer} from 'rxjs';
import {JobofferService} from 'src/app/services/joboffer.service';
import {FilterPipe} from 'src/app/filter.pipe';
import {ApiDataService} from "../../services/api-data.service";
import {CurrentUser} from 'src/app/models/currentuser';
import {JobtypeService} from 'src/app/services/jobtype.service';
import {JobType} from 'src/app/models/jobtype';
import {SearchService} from 'src/app/services/search.service';
import {Search} from 'src/app/models/search';
import {Router} from '@angular/router';
import {JobhistoryService} from "../../services/jobhistory.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ToastrService} from "ngx-toastr";


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
  currentUser!: CurrentUser;
  allDomains: string[] = [];
  allTypes: string[] = [];
  page = 1;
  pageSize = 6;
  currentPage = 1;
  pages = [1];
  jobtypes!: JobType[];
  searches!: Search[];
  selectedJobOffer: JobOffer | null = null;
  showLoader: boolean = true;
  apiOffers: any[] = [];
  jobOffersWithIcons: boolean = false;
  ids: any;

  constructor(private router: Router,public jobofferService: JobofferService, private jobtypeService: JobtypeService, private searchService: SearchService,
              private dataService: ApiDataService, private filter: FilterPipe, private authentificationService: AuthenticationService,
              private jobhistoryService: JobhistoryService,  private toastr: ToastrService) { }

  ngOnInit(): void {
    this.jobofferService.setPages(this.pages);
    this.authentificationService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser || this.authentificationService.getCurrentUser();
    });
    this.getOffers();
    timer(1000).subscribe(() => {
      this.showLoader = false;
    });
    interval(5000).subscribe(() => this.jobofferService
      .getJobOffer()
      .subscribe((result: JobOffer[]) => (this.joboffers = result)));
    this.dataService.currentData.subscribe(data => {
      this.data = data;
      this.apiOffers = this.data;
    });
    this.jobtypeService
      .getJobType()
      .subscribe((result: JobType[]) => (this.jobtypes = result));
    this.searchService.getSearch().subscribe((result: Search[]) => (this.searches = result));

    this.jobhistoryService.getJobOfferHistory().subscribe((res) => {
      res.map((jobOffer: any) => {
        console.log(jobOffer.idOffer, 'idoffer', jobOffer.idUser,'iduser', this.currentUser.id, 'currentuser');
        const isFavorite = jobOffer.idUser === this.currentUser.id;
        console.log({...jobOffer, isFavorite}, 'joboffer favorite')
        return {...jobOffer, isFavorite};
      });
    });
  }

  public closeJobOfferDetails() {
    this.selectedJobOffer = null;
  }
  setNumberPage(filteredJoboffers: JobOffer[]) {
    this.pages = [];
    for (let i = 1; i <= filteredJoboffers.length / 6; i++) {
      this.pages.push(i);
    }
  }

  openSavedJobOffers() {
    const savedJobOffers = this.jobofferService.getSavedJobOffers();
    this.router.navigate(['/compare'], { state: { savedJobOffers } });
  }

  getOffers() {
    this.jobofferService.getJobOffer().subscribe((result: JobOffer[]) => {
      this.joboffers = result;
      // Obtenir l'historique des offres d'emploi
      this.jobhistoryService.getJobOfferHistory().subscribe((res) => {
        this.joboffers = this.joboffers.map((jobOffer) => {
          const index = res.findIndex((jobOfferHistory: any) => jobOffer.id === jobOfferHistory.idOffer && jobOfferHistory.idUser === this.currentUser.id);
          if (index !== -1) {
            return {...jobOffer, isFavorite: true};
          } else {
            return jobOffer;
          }
        }); // Mettre à jour this.joboffers avec les offres d'emploi mises à jour
        console.log(this.joboffers, 'sdvsvs')
        this.ids = this.joboffers.map((jobOffer) => jobOffer.id);
        console.log(this.ids, 'ids');
      });
    });
  }


  get joboffersToDisplay(): JobOffer[] {
    let filteredJoboffers = this.joboffers;
    filteredJoboffers = this.filter.transform(filteredJoboffers, this.domainFilter, this.locationFilter, this.jobtypefilter);
    this.setNumberPage(filteredJoboffers);
    this.jobofferService.getOffersAfterSearch(filteredJoboffers)
    const newPages = filteredJoboffers.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    this.jobofferService.setPages(this.pages)
    this.searchService.updateOfferToDisplay(newPages)
    return newPages
  }

  setPage(page: number) {
    this.currentPage = page;
    this.page = page;
    this.jobofferService.setCurrentPage(this.currentPage)
  }

  showDetails(joboffer: JobOffer) {
    this.selectedJobOffer = joboffer;
  }

  updateFilters(filters: { domain: string, location: string, jobtype: string }): void {
    this.domainFilter = filters.domain;
    this.locationFilter = filters.location;
    this.jobtypefilter = filters.jobtype;
    this.page = 1;
    this.currentPage = 1
    this.jobofferService.setCurrentPage(this.currentPage)
  }

  searchNewOffer() {
    const randomDomain = this.searches[Math.floor(Math.random() * this.searches.length)];
    this.searchService.setCreatednewrandom({ domain: randomDomain });
    this.updateFilters({
      domain: randomDomain.filter,
      location: "",
      jobtype: ""
    });
  }
}

