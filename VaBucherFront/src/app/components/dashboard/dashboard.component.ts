import { Component } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userInput = 'developer';
  jobs = [];

  constructor(private http: HttpClient) {}

  searchJobs(query: string) {
    this.http.get(`https://openjobsearch.org/api/search?q=${query}`).subscribe(data => {
      console.log(data);
    });
  }
}
