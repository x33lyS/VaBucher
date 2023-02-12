import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { User } from 'src/app/models/user';
import { ApiDataService } from 'src/app/services/api-data.service';
import { JobofferService } from 'src/app/services/joboffer.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchService } from "../../services/search.service";
import { Search } from "../../models/search";
import { JobtypeService } from "../../services/jobtype.service";
import { JobType } from "../../models/jobtype";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  joboffers: JobOffer[] = [];
  users: User[] = [];
  search: Search[] = [];
  jobType: JobType[] = [];
  data: any[] = [];

  @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private userService: UserService, private jobofferService: JobofferService,
    private dataService: ApiDataService,
    public dialog: MatDialog,
    private searchService: SearchService,
    private jobtypeService: JobtypeService
  ) { }


  ngOnInit(): void {
    this.jobofferService
      .getJobOffer()
      .subscribe((result: JobOffer[]) => (this.joboffers = result));
    this.dataService.currentData.subscribe(data => {
      this.data = data;
    });
    this.userService
      .getUser()
      .subscribe((result: User[]) => (this.users = result));
    this.searchService
      .getSearch()
      .subscribe((result: Search[]) => (this.search = result));
    this.jobtypeService
      .getJobType()
      .subscribe((result: any[]) => (this.jobType = result));
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

  updateOffer(joboffer: JobOffer) {
    const dialogRef = this.dialog.open(DialogUpdateJobOffer, {
      width: '600px',
      height: '600px',
      data: joboffer
    });

    dialogRef.afterClosed().subscribe(result => {
    });
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

  addSearch() {
    const dialogRef = this.dialog.open(DialogAddSearch, {
      width: '400px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result, 'result')
      if (result) {
        this.searchService
          .createSearch(result)
          .subscribe((search: Search[]) => this.search = search);
        console.log(this.search, "search")
      }
    });
  }

  updateSearch(search: Search) {
    const dialogRef = this.dialog.open(DialogUpdateSearch, {
      width: '400px',
      height: '400px',
      data: search
    });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
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

  addJobType() {
    const dialogRef = this.dialog.open(DialogAddJobType, {
      width: '400px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jobtypeService
          .createJobType(result)
          .subscribe((jobType: JobType[]) => this.jobType = jobType);
      }
    });
  }

  updateJobType(jobType: JobType) {
    const dialogRef = this.dialog.open(DialogUpdateJobType, {
      width: '400px',
      height: '400px',
      data: jobType
    });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  deleteJobType(jobType: JobType) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '250px',
      data: { message: 'Etes-vous sûr de vouloir supprimer cette offre d\'emploi ?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jobtypeService
          .deleteJobType(jobType)
          .subscribe((jobType: JobType[]) => this.jobType = jobType);
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

@Component({
  selector: 'dialog-add-search',
  template:
    '<h1 mat-dialog-title>Ajouter un filtre</h1>' +
    '<mat-form-field appearance="fill">\n' +
    '    <mat-label>Filter</mat-label>\n' +
    '    <input matInput [(ngModel)]="searchTerm">\n' +
    ' </mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '  <button mat-button mat-dialog-close="false">Annuler</button>' +
    '  <button mat-button (click)="addSearch()" [mat-dialog-close]="search" cdkFocusInitial>Ajouter</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; }' +
    'mat-dialog-content { display: flex; flex-direction: column; }' +
    'button { margin: 10px; width: 50%; }' +
    'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']

})
export class DialogAddSearch {
  search: Search = new Search();
  searchTerm = "";
  constructor(
    public dialogRef: MatDialogRef<DialogAddSearch>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddSearch,
    private searchService: SearchService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

  }

  addSearch() {
    this.search.filter = this.searchTerm;
  }
}

@Component({
  selector: 'dialog-update-search',
  template:
    '<h1 mat-dialog-title>Modifier un filtre</h1>' +
    '<mat-form-field appearance="fill">\n' +
    '    <mat-label>Filter</mat-label>\n' +
    '    <input matInput [value]="filter" [(ngModel)]="filter">\n' +
    ' </mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '  <button mat-button mat-dialog-close>Annuler</button>' +
    '  <button mat-button (click)="updateSearch()" [mat-dialog-close]="search" cdkFocusInitial>Modifier</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; }' +
    'mat-dialog-content { display: flex; flex-direction: column; }' +
    'button { margin: 10px; width: 50%; }' +
    'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']

})
export class DialogUpdateSearch {
  search: Search = new Search() ;
  filter: any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddSearch>,
    @Inject(MAT_DIALOG_DATA) public data: Search,
    private searchService: SearchService,
    public dialog: MatDialog,
  ) {
    this.filter = data.filter;
  }

  ngOnInit(): void {

  }
  updateSearch() {
    this.search.filter = this.filter;
    this.search.id = this.data.id;
    this.searchService
      .updateSearch(this.search)
      .subscribe();
  }
}

@Component({
  selector: 'dialog-add',
  template:
    '<h1 mat-dialog-title>Ajouter un type de contrat</h1>' +
    '<mat-form-field appearance="outline">\n' +
    '    <mat-label>Job Type</mat-label>\n' +
    '    <input matInput [(ngModel)]="jobtype">\n' +
    ' </mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '  <button mat-button mat-dialog-close>Annuler</button>' +
    '  <button mat-button (click)="updateJobType()" [mat-dialog-close]="jobtype" cdkFocusInitial>Modifier</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; }' +
    'mat-dialog-content { display: flex; flex-direction: column; }' +
    'button { margin: 10px; width: 50%; }' +
    'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']
})
export class DialogUpdateJobType {
  jobType: JobType[] = [];
  jobtype: any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddSearch>,
    @Inject(MAT_DIALOG_DATA) public data: JobType,
    private jobtypeService: JobtypeService,
    public dialog: MatDialog,
  ) {
    this.jobtype = data.jobs;
    console.log(this.jobtype)
  }

  ngOnInit(): void {
  }
  updateJobType() {
    const newJobType = new JobType();
    newJobType.id = this.data.id;
    newJobType.jobs = this.jobtype;
    console.log(newJobType)
    this.jobtypeService
      .updateJobType(newJobType)
      .subscribe(() => console.log('Job Type updated successfully.'));
  }
}

@Component({
  selector: 'dialog-add-jobtype',
  template:
    '<h1 mat-dialog-title>Ajouter un type de contrat</h1>' +
    '<mat-form-field appearance="outline">\n' +
    '    <mat-label>Job Type</mat-label>\n' +
    '    <input matInput [(ngModel)]="jobtypeTerm">\n' +
    ' </mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '  <button mat-button mat-dialog-close>Annuler</button>' +
    '  <button mat-button (click)="addSearch()" [mat-dialog-close]="jobType" cdkFocusInitial>Ajouter</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; }' +
    'mat-dialog-content { display: flex; flex-direction: column; }' +
    'button { margin: 10px; width: 50%; }' +
    'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']

})
export class DialogAddJobType {
  jobType: JobType = new JobType();
  jobtypeTerm?: "";
  constructor(
    public dialogRef: MatDialogRef<DialogAddSearch>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddSearch,
    private jobtypeService: JobtypeService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

  }
  addSearch() {
    this.jobType.jobs = this.jobtypeTerm;
  }
}

@Component({
  selector: 'dialog-add',
  template:
    '<mat-form-field appearance="outline">' +
    '<mat-label>Titre</mat-label>' +
    '<input matInput [value]="joboffers.title" [(ngModel)]="joboffers.title">' +
    '</mat-form-field>' +
    '<mat-form-field appearance="outline">' +
    '<mat-label>Description</mat-label>' +
    '<textarea matInput [value]="joboffers.description" [(ngModel)]="joboffers.description" [rows]="20"></textarea>' +
    '</mat-form-field>' +
    '<mat-form-field appearance="outline">' +
    '<mat-label>Salaire</mat-label>' +
    '<input matInput [value]="joboffers.salaire" [(ngModel)]="joboffers.salaire">' +
    '</mat-form-field>' +
    '<mat-form-field appearance="outline">' +
    '<mat-label>Localisation</mat-label>' +
    '<input matInput [value]="joboffers.localisation" [(ngModel)]="joboffers.localisation">' +
    '</mat-form-field>' +
    '<mat-form-field appearance="outline">' +
    '<mat-label>Types</mat-label>' +
    '<input matInput [value]="joboffers.types" [(ngModel)]="joboffers.types">' +
    '</mat-form-field>' +
    '<mat-form-field appearance="outline">' +
    '<mat-label>Company Info</mat-label>' +
    '<input matInput [value]="joboffers.companyInfo" [(ngModel)]="joboffers.companyInfo">' +
    '</mat-form-field>' +
    '<mat-form-field appearance="outline">' +
    '<mat-label>Domain</mat-label>' +
    '<input matInput [value]="joboffers.domain" [(ngModel)]="joboffers.domain">' +
    '</mat-form-field>' +
    '<mat-form-field appearance="outline">' +
    '<mat-label>Date</mat-label>' +
    '<input matInput [value]="joboffers.isNew" [(ngModel)]="joboffers.isNew">' +
    '</mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '<button mat-button mat-dialog-close>Annuler</button>' +
    '<button mat-button (click)="updateJobOffer()" [mat-dialog-close]="joboffers" cdkFocusInitial>Modifier</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; padding: 30px; }' +
    'mat-dialog-content { display: flex; flex-direction: column; }' +
    'button { margin: 10px; width: 50%; }' +
    'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']
})
export class DialogUpdateJobOffer {
  joboffers: JobOffer | any = [];
  jobOffer: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogAddSearch>,
    @Inject(MAT_DIALOG_DATA) public data: JobOffer,
    private jobofferService: JobofferService,
    public dialog: MatDialog,
  ) {
    this.joboffers = data;
  }

  ngOnInit(): void {
  }
  updateJobOffer() {
    const newJobOffer = new JobOffer();
    newJobOffer.id = this.joboffers.id;
    newJobOffer.title = this.joboffers.title;
    newJobOffer.description = this.joboffers.description;
    newJobOffer.salaire = this.joboffers.salaire;
    newJobOffer.localisation = this.joboffers.localisation;
    newJobOffer.types = this.joboffers.types;
    newJobOffer.companyInfo = this.joboffers.companyInfo;
    newJobOffer.domain = this.joboffers.domain;
    newJobOffer.isNew = this.joboffers.isNew;
    console.log(newJobOffer, "newJobOffer")
    this.jobofferService
      .updateJobOffer(newJobOffer)
      .subscribe(() => console.log('Job offer updated successfully.'));
  }
}
