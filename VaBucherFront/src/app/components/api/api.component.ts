import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiDataService} from "../../services/api-data.service";
import {FilterPipe} from "../../filter.pipe";
import {JobofferComponent} from "../joboffer/joboffer.component";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  providers: [FilterPipe]
})
export class ApiComponent implements OnInit {
  private token = 'GkA3Rh6uZnyG86hUnejVIV5Ty4w';
  apiData: any[] = [];
  locationFilter?: string;
  jobtypefilter?: string;
  poleEmploiDomainFilter?: string;
  poleEmploiLocationFilter?: string;
  ApiResult: boolean = true;

  constructor(private http: HttpClient,
              private dataService: ApiDataService,
              private toastr: ToastrService,
              ) { }

  ngOnInit(): void {
    this.dataService.filterPoleEmploiLocation$.subscribe(poleEmploiLocation => {
      this.locationFilter = poleEmploiLocation;
    });
    this.dataService.filterPoleEmploiDomain$.subscribe(poleEmploiDomain => {
      this.poleEmploiDomainFilter = poleEmploiDomain;
    });
    this.dataService.filterPoleEmploiDomain$.pipe(
      debounceTime(1500),
    ).subscribe(poleEmploiDomain => {
      this.poleEmploiDomainFilter = poleEmploiDomain;
      this.fetchApiData();
    });
    this.dataService.filterPoleEmploiLocation$.pipe(
      debounceTime(1500),
    ).subscribe(poleEmploiLocation => {
      this.locationFilter = poleEmploiLocation;
      this.fetchApiData();
    });
  }

  fetchApiData() {
    const apiUrl = `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.poleEmploiDomainFilter}&origineOffre=0`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
    });
    this.http.get(`${apiUrl}`, { headers }).subscribe(
      (response: any) => {
        if (response && response.resultats) {
          response.resultats.forEach((item: any) => {
            if (!this.apiData.find(x => x.id === item.id)) {
              this.apiData.push(item);
            }
          });
          this.apiData = this.apiData.filter((item: any) => item.lieuTravail.libelle.toLowerCase().includes(this.locationFilter?.toLowerCase()));
          this.ApiResult = this.apiData.length === 0;
          this.dataService.updateData(this.apiData);
          this.ApiResult = true;
        } else {
          console.log("No resultats found in API response");
          this.ApiResult = false;
        }
      },
      (error) => {
        console.log("API call failed:", error);
        this.toastr.error("Une erreur est survenue lors de la récupération des données");
      }
    );
  }
}
