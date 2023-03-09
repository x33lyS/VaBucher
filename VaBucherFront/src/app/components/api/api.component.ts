import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiDataService} from "../../services/api-data.service";
import {FilterPipe} from "../../filter.pipe";
import {JobofferComponent} from "../joboffer/joboffer.component";
import {debounceTime, distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  providers: [FilterPipe]
})
export class ApiComponent implements OnInit {
  private token = 'euow6nUm8iFuEUKU4xfRUeoc2k8';
  apiData: any[] = [];
  domainFilter?: string;
  locationFilter = ['51069', '76322', '46083', '12172', '28117'];
  jobtypefilter?: string;
  poleEmploiDomainFilter?: string;

  constructor(private http: HttpClient,
              private dataService: ApiDataService,
              ) { }

  ngOnInit(): void {
    this.dataService.filterPoleEmploiDomain$.subscribe(poleEmploiDomain => {
      this.poleEmploiDomainFilter = poleEmploiDomain;
      console.log(this.poleEmploiDomainFilter)
    });
    this.dataService.filterPoleEmploiDomain$.pipe(
      debounceTime(1500),
    ).subscribe(poleEmploiDomain => {
      this.poleEmploiDomainFilter = poleEmploiDomain;
      console.log(this.poleEmploiDomainFilter);
      this.fetchApiData(); // Refaire l'appel à l'API avec la nouvelle donnée
    });


  }

  fetchApiData() {
    this.apiData = [];
    const apiUrl = `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.poleEmploiDomainFilter}&commune=${this.locationFilter}&origineOffre=0`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
    });
    this.http.get(`${apiUrl}`, { headers }).subscribe(
      (response: any) => {
        if (response && response.resultats) {
          response.resultats.forEach((item: any) => {
            if (!this.apiData.find(x => x.id === item.id)) {
              this.apiData.push(item);
              this.dataService.updateData(this.apiData);
              console.log(this.apiData, "apiData")
            }
          });
        } else {
          console.log("No resultats found in API response");
        }
      },
      (error) => {
        console.log("API call failed:", error);
      }
    );
  }

}
