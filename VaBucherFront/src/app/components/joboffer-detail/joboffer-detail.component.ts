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


  constructor(private jobOfferService: JobofferService, private authService: AuthenticationService,
              private _snackBar: MatSnackBar, private toastr: ToastrService,private jobhistoryService: JobhistoryService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.access = true;
    }
    console.log(this.selectedJoboffer);

  }
  saveHistory(joboffer: JobOffer) {
    // @ts-ignore
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const currentUserId = currentUser.id;
    const currentJobOfferId = joboffer.id;
    const updatedJobOffer = {...joboffer, isSaved: true};
    console.log('Creating job history for user', currentUserId, 'and job offer', currentJobOfferId);

    this.jobOfferService.getJobOfferById(currentJobOfferId).subscribe(
      jobOffer => {
        if (jobOffer.isSaved) {
          this.jobhistoryService.deleteJobOfferHistory(currentJobOfferId, currentUserId).subscribe(
            jobHistoryList => {
              console.log('Job history deleted successfully:', jobHistoryList);
              this.updateJobOfferAndSetIsSavedFalse(joboffer);
              this.toastr.success('Offre d\'emploi supprimée de vos favoris', 'Success', {
                positionClass: 'toast-top-left',
              });
              this.selectedJoboffer.isSaved = false;

            },
            error => {
              console.error('Error deleting job history:', error);
            }
          );
        } else {
          this.jobhistoryService.createJobOfferHistory(currentJobOfferId, currentUserId).subscribe(
            jobHistoryList => {
              this.toastr.success('Offre ajoutée à vos favoris', 'Success', {
                positionClass: 'toast-top-left',
              });
              this.selectedJoboffer.isSaved = true;

              this.jobOfferService.updateJobOffer(updatedJobOffer).subscribe(
                updatedJobOfferList => {
                  console.log('Job offer updated successfully:', updatedJobOfferList);
                },
                error => {
                  console.error('Error updating job offer:', error);
                }
              );
              console.log('Job history created successfully:', jobHistoryList);
            },
            error => {
              console.error('Error creating job history:', error);
            }
          );
        }
      }
    );
  }

  updateJobOfferAndSetIsSavedFalse(joboffer: JobOffer) {
    joboffer.isSaved = false;
    this.jobOfferService.updateJobOffer(joboffer).subscribe(
      updatedJobOfferList => {
        console.log('Job offer updated successfully:', updatedJobOfferList);
      },
      error => {
        console.error('Error updating job offer:', error);
      }
    );
  }
  saveJobOffer() {
    this.jobOfferService.saveJobOffer(this.selectedJoboffer);
  }

  onClose() {
    this.close.emit();
  }


}
