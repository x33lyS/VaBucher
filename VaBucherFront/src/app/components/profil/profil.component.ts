import {Component,EventEmitter,OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {CurrentUser} from 'src/app/models/currentuser';
import {UserService} from 'src/app/services/user.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {FormControl,FormGroup,Validators} from "@angular/forms";
import {JobhistoryService} from "../../services/jobhistory.service";
import {Jobhistory} from "../../models/jobhistory";
import {JobofferService} from "../../services/joboffer.service";
import {map} from "rxjs";
import {JobOffer} from "../../models/joboffer";
import {ToastrService} from "ngx-toastr";
import {animate,state,style,transition,trigger} from "@angular/animations";
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  animations: [
    trigger('deleteAnimation',[
      state('deleted',style({
        opacity: 0,
        transform: 'scale(0.8)',
        display: 'none'
      })),
      transition('* => deleted',[
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class ProfilComponent implements OnInit {
  currentUser!: CurrentUser;
  jobofferhistory: JobOffer[] = [];
  passwordFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(6)
  ]);
  currentUserData: string | null = '';

  passwordForm = new FormGroup({
    newPassword: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  
  @Output() usersUpdated = new EventEmitter<User[]>();
  constructor(
    private userService: UserService,
    private authentificationService: AuthenticationService,
    private router: Router,
    private jobhistoryService: JobhistoryService,
    private jobofferService: JobofferService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {

    this.jobhistoryService.getJobOfferHistory().pipe(
      map((jobHistoryList: Jobhistory[]) => jobHistoryList.map((jobHistory: Jobhistory) => jobHistory.idOffer))
      // @ts-ignore
    ).subscribe((jobHistoryIds: number[]) => {

      this.jobofferService.getJobOffer().subscribe((jobOfferList: JobOffer[]) => {
        // @ts-ignore
        jobOfferList.filter((jobOffer: JobOffer) => jobHistoryIds.includes(jobOffer.id))
          .forEach((jobOffer: JobOffer) => {
            // @ts-ignore
            this.jobofferhistory.push(jobOffer);
          });
      });
    });

    this.authentificationService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.currentUserData = sessionStorage.getItem('currentUser');
    if (this.currentUserData) {
      this.currentUser = JSON.parse(this.currentUserData);
    }
  }

  updateCurrentUser() {
  // Call the updateUser() method of your userService to save the changes to the server
  this.userService
          .updateUser(this.currentUser)
          .subscribe((users: User[]) => this.usersUpdated.emit(users));
          sessionStorage.setItem('currentUser',JSON.stringify(this.currentUser));
        this.toastr.warning('Utilisateur modifié avec succès', 'Success', {
          positionClass: 'toast-top-left',
        });
}
          

updateCurrentUserPassword() {
  if (this.passwordForm.invalid) {
    this.toastr.error('Mot de passe invalide','Erreur',{
      positionClass: 'toast-top-left',
    });
    return;
  }
  if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
    this.toastr.error('Les mots de passe ne correspondent pas','Erreur',{
      positionClass: 'toast-top-left',
    });
    return;
  }
  if(this.passwordForm.value.newPassword != null) {
  this.currentUser.password = this.passwordForm.value.newPassword;
  }
  this.userService
      .updateUser(this.currentUser)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
  sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  this.toastr.success('Mot de passe modifié avec succès', 'Success', {
    positionClass: 'toast-top-left',
  });
  this.passwordForm.reset();
}


  deleteHistory(joboffer: JobOffer | any) {
    joboffer.state = 'deleted';
    // @ts-ignore
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const currentUserId = currentUser.id;
    const currentJobOfferId = joboffer.id;
    this.jobhistoryService.deleteJobOfferHistory(currentJobOfferId,currentUserId).subscribe(
      jobHistoryList => {
        this.updateJobOfferAndSetIsSavedFalse(joboffer);
        this.toastr.success('Offre d\'emploi supprimée de vos favoris','Success',{
          positionClass: 'toast-top-left',
        });
      },
      error => {
        console.error('Error deleting job history:',error);
      }
    );
  }

  updateJobOfferAndSetIsSavedFalse(joboffer: JobOffer) {
    this.jobofferService.updateJobOffer(joboffer).subscribe(
      updatedJobOfferList => {

      },
      error => {
        console.error('Error updating job offer:',error);
      }
    );
  }


}


