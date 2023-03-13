import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiDataService} from "../../services/api-data.service";
import {FilterPipe} from "../../filter.pipe";
import {JobofferComponent} from "../joboffer/joboffer.component";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {JobofferService} from "../../services/joboffer.service";

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  providers: [FilterPipe]
})
export class ApiComponent implements OnInit {
  private token = 'YEfnI01OFRTT7J4ArYYgmzVk864';
  apiData: any[] = [];
  locationFilter?: string;
  jobtypefilter?: any | [];
  poleEmploiDomainFilter?: string;
  poleEmploiLocationFilter?: string;
  ApiResult: boolean = true;

  constructor(private http: HttpClient,
              private dataService: ApiDataService,
              private toastr: ToastrService,
              private jobofferService: JobofferService
              ) { }

  ngOnInit(): void {


    this.dataService.filterPoleEmploiJobType$.subscribe(poleEmploiJobType => {
      this.jobtypefilter = poleEmploiJobType;
    });
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
    this.apiData = [];
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
          const jobtypeFilterArray = this.jobtypefilter?.map((type: string) => type.toLowerCase());
          if (jobtypeFilterArray.length > 0) {
            this.apiData = this.apiData.filter((item: any) => {
              return jobtypeFilterArray.some((type: any) => item.typeContrat.toLowerCase().includes(type));
            });
          }
          this.dataService.updateData(this.apiData);
          this.ApiResult = false;
        } else {
          console.log("No resultats found in API response");
          this.ApiResult = true;
        }
      },
      (error) => {
        console.log("API call failed:", error);
        this.toastr.error("Une erreur est survenue lors de la récupération des données");
      }
    );
  }
}
