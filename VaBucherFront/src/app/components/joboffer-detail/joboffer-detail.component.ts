import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrentUser } from 'src/app/models/currentuser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { JobofferService } from 'src/app/services/joboffer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { JobhistoryService } from 'src/app/services/jobhistory.service';
import { JobOffer } from 'src/app/models/joboffer';


@Component({
  selector: 'app-joboffer-detail',
  templateUrl: './joboffer-detail.component.html',
  styleUrls: ['./joboffer-detail.component.scss']
})
export class JobofferDetailComponent {
  @Input() selectedJoboffer: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter();
  currentUser!: CurrentUser | null;
  access: boolean = false


  constructor(public jobofferService: JobofferService, private authService: AuthenticationService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.access = true;
    }
    console.log(this.selectedJoboffer);

  }
  saveJobOffer() {
    this.jobofferService.saveJobOffer(this.selectedJoboffer);
  }

  onClose() {
    this.close.emit();
  }


}
