import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/models/currentuser';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {FormControl,Validators} from "@angular/forms";
import {JobhistoryService} from "../../services/jobhistory.service";
import {Jobhistory} from "../../models/jobhistory";
import {JobofferService} from "../../services/joboffer.service";
import {map} from "rxjs";
import {JobOffer} from "../../models/joboffer";



@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  currentUser!: CurrentUser;
  jobofferhistory: JobOffer[] = [];
  passwordFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(6)
  ]);
  currentUserData: string | null = '';


  constructor(
    private userService: UserService,
    private authentificationService: AuthenticationService,
    private router: Router,
    private jobhistoryService: JobhistoryService,
    private jobofferService: JobofferService
  ) { }

  ngOnInit() {

    this.jobhistoryService.getJobOfferHistory().pipe(
      map((jobHistoryList: Jobhistory[]) => jobHistoryList.map((jobHistory: Jobhistory) => jobHistory.idOffer))
      // @ts-ignore
    ).subscribe((jobHistoryIds: number[]) => {
      console.log(jobHistoryIds); // Affiche les IDs des enregistrements d'historique d'emploi dans la console

      this.jobofferService.getJobOffer().subscribe((jobOfferList: JobOffer[]) => {
        // @ts-ignore
        jobOfferList.filter((jobOffer: JobOffer) => jobHistoryIds.includes(jobOffer.id))
          .forEach((jobOffer: JobOffer) => {
            // @ts-ignore
            this.jobofferhistory.push(jobOffer);
            console.log(jobOffer, 'job'); // Affiche l'offre d'emploi correspondante dans la console
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
    let newUser = this.currentUser;

    for (let key in newUser) {
      // @ts-ignore
      if (newUser[key] === null || newUser[key] === undefined || newUser[key] === '') {
        // @ts-ignore
        delete newUser[key];
      }
    }
    this.userService.updateUser(this.currentUser)
    .subscribe(data => {
      if (this.currentUserData) {
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      }
    });
  }

  deleteHistory(joboffer: JobOffer) {
    // @ts-ignore
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const currentUserId = currentUser.id;
    const currentJobOfferId = joboffer.id;
    this.jobhistoryService.deleteJobOfferHistory(currentJobOfferId, currentUserId).subscribe(
      jobHistoryList => {
        console.log('Job history created successfully:', jobHistoryList);
      },
      error => {
        console.error('Error creating job history:', error);
      }
    );
  }

}


