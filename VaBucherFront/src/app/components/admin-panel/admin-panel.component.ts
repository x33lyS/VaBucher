import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { User } from 'src/app/models/user';
import { ApiDataService } from 'src/app/services/api-data.service';
import { JobofferService } from 'src/app/services/joboffer.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import {SearchService} from "../../services/search.service";
import {Search} from "../../models/search";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  joboffers: JobOffer[] = [];
  users: User[] = [];
  search: Search[] = [];
  data: any[] = [];

    @Input() user?: User;
    @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private userService:UserService,private jobofferService: JobofferService,
              private dataService: ApiDataService,
              public dialog: MatDialog,
              private searchService: SearchService
              ) {}

  ngOnInit(): void {
    interval(2000).subscribe(() => this.jobofferService
    .getJobOffer()
    .subscribe((result: JobOffer[]) => (this.joboffers = result)));
  this.dataService.currentData.subscribe(data => {
    this.data = data;
  });
    interval(2000).subscribe(() => this.userService
      .getUser()
      .subscribe((result: User[]) => (this.users = result)));
    interval(2000).subscribe(() => this.searchService
      .getSearch()
      .subscribe((result: Search[]) => (this.search = result)));
  }

  updateUser(user: User) {
    this.userService
      .updateUser(user)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '250px',
      data: { message: 'Etes-vous sûr de vouloir supprimer cette utilisateur ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.userService
          .deleteUser(user)
          .subscribe((users: User[]) => this.usersUpdated.emit(users));
      }
    });
  }

  createUser(user: User) {
    this.userService
      .createUser(user)
      .subscribe(
        // @ts-ignore
        (users: User[]) => this.usersUpdated.emit(users),
      );
  }

  deleteOffer(joboffer: JobOffer) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '250px',
      data: { message: 'Etes-vous sûr de vouloir supprimer cette offre d\'emploi ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.jobofferService
          .deleteJobOffer(joboffer)
          .subscribe((joboffers: JobOffer[]) => this.joboffers = joboffers);
      }
    });
  }

  deleteSearch(search: Search) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '250px',
      data: { message: 'Etes-vous sûr de vouloir supprimer cette offre d\'emploi ?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchService
          .deleteSearch(search)
          .subscribe((search: Search[]) => this.search = search);
      }
    });
  }

}
@Component({
  selector: 'dialog-content-example-dialog',
  template:
    '<h1 mat-dialog-title>Etes vous certain de vouloir supprimer ?</h1>' +
    '<mat-dialog-actions align="end">' +
    '  <button mat-button mat-dialog-close>Non</button>' +
    '  <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Oui</button>' +
    '</mat-dialog-actions>',

})
export class DialogContentExampleDialog {

}
