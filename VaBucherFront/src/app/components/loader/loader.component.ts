import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { JobofferService } from 'src/app/services/joboffer.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public isVisible: boolean = true;

  constructor(public jobofferService: JobofferService) {
    this.jobofferService.getJobOffer().subscribe(() => {
      this.isVisible = false;
    });
  }
  ngOnInit(): void {
  }
}
