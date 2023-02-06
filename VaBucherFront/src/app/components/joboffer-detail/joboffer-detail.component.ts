import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-joboffer-detail',
  templateUrl: './joboffer-detail.component.html',
  styleUrls: ['./joboffer-detail.component.scss']
})
export class JobofferDetailComponent {
  @Input() selectedJoboffer: any;



  ngOnInit(): void {
    console.log(this.selectedJoboffer);

  }
}
