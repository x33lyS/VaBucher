import { Component } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private apiUrl = 'https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=informatique&commune=51069,76322,46083,12172,28117&origineOffre=2';
  private token = 'e85tZgTULngSuHk_THFmQI9-rXo';

  constructor(private http: HttpClient) {}

  getOffresEmploi() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
    });

    this.http.get(`${this.apiUrl}`, { headers }).subscribe(data => console.log(data));
  }
}
