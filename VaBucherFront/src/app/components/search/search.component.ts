import { Component, EventEmitter, Output } from '@angular/core';
import { JobOffer } from 'src/app/models/joboffer';
import { JobofferService } from 'src/app/services/joboffer.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiDataService} from "../../services/api-data.service";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  domainFilter!: string;
  locationFilter!: string;
  salaryFilter!: string;
  apiData: any[] = [];

  @Output() jobOffersUpdated = new EventEmitter<JobOffer[]>();
  @Output() filtersChanged = new EventEmitter<{domain: string, location: string, salary: string}>();
  private token = 'qQXLAMeZBi0kgujYwkbGCuX4t_w';

  constructor(private jobofferService: JobofferService,
              private http: HttpClient,
              private dataService: ApiDataService) { }

  onSubmit() {
    const apiUrl =  `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.domainFilter}&commune=${this.locationFilter}&origineOffre=0`;
    const joboffer = new JobOffer();
    joboffer.domain = this.domainFilter;
    this.jobofferService.createJobOffer(joboffer).subscribe((result: JobOffer[]) => this.jobOffersUpdated.emit(result));
    this.filterJobOffers();
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
    });
    // @ts-ignore
    this.http.get(`${apiUrl}`, { headers }).subscribe(({resultats}) => {
      resultats.forEach((item: any) => {
        if (!this.apiData.find(x => x.id === item.id)) {
          this.apiData.push(item);
          this.dataService.updateData(this.apiData);
        }
      });
    });
  }

  filterJobOffers() {
    this.filtersChanged.emit({domain: this.domainFilter, location: this.locationFilter, salary: this.salaryFilter});
  }
}
