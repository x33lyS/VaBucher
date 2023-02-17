import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-joboffer-detail',
  templateUrl: './joboffer-detail.component.html',
  styleUrls: ['./joboffer-detail.component.scss']
})
export class JobofferDetailComponent {
  @Input() selectedJoboffer: any;
  @Output() close = new EventEmitter<void>();




  ngOnInit(): void {
    console.log(this.selectedJoboffer);

  }


  onClose() {
    this.close.emit();
  }


}
