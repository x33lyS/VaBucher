import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobofferService } from 'src/app/services/joboffer.service';

@Component({
  selector: 'app-joboffer-detail',
  templateUrl: './joboffer-detail.component.html',
  styleUrls: ['./joboffer-detail.component.scss']
})
export class JobofferDetailComponent {
  @Input() selectedJoboffer: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter();



  constructor(private jobOfferService: JobofferService) { }

  ngOnInit(): void {
    console.log(this.selectedJoboffer);

  }
  saveJobOffer() {
    this.jobOfferService.saveJobOffer(this.selectedJoboffer);
  }
  
  onClose() {
    this.close.emit();
  }


}
