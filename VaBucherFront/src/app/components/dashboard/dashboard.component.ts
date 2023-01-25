import { Component } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  motsCles!: string;
  commune:  number[] = [31120];

  private apiUrl =  `https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?qualification=0&motsCles=${this.motsCles}&commune=${this.commune}&origineOffre=2`;
  private token = 'RRN9RmuTX3zbrFeZAVLTd0WhfrI';

  constructor(private http: HttpClient) {
  }

  getOffresEmploi() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
    });

    this.http.get(`${this.apiUrl}`, { headers }).subscribe(data => console.log(data));
  }
}
