import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import { interval } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { User } from 'src/app/models/user';
import { ApiDataService } from 'src/app/services/api-data.service';
import { JobofferService } from 'src/app/services/joboffer.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {SearchService} from "../../services/search.service";
import {Search} from "../../models/search";
import {JobtypeService} from "../../services/jobtype.service";
import {JobType} from "../../models/jobtype";

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

  constructor(private userService:UserService,private jobofferService: JobofferService,
              private dataService: ApiDataService,
              public dialog: MatDialog,
              private searchService: SearchService,
              private jobtypeService: JobtypeService
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
    interval(2000).subscribe(() => this.jobtypeService
      .getJobType()
      .subscribe((result: any[]) => (this.jobType = result)));
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
      if (result) {

      }
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
      data: { filter: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
      data: { filter: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  updateJobType(jobType: JobType) {
    const dialogRef = this.dialog.open(DialogUpdateJobType, {
      width: '400px',
      height: '400px',
      data: jobType
    });
    dialogRef.afterClosed().subscribe(result => {
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
  selector: 'dialog-add',
  template:
    '<h1 mat-dialog-title>Ajouter un filtre</h1>' +
    '<mat-form-field appearance="fill">\n' +
    '    <mat-label>Filter</mat-label>\n' +
    '    <input matInput [(ngModel)]="filter">\n' +
    ' </mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '  <button mat-button mat-dialog-close>Annuler</button>' +
    '  <button mat-button (click)="addSearch()" [mat-dialog-close]="filter" cdkFocusInitial>Ajouter</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; }' +
  'mat-dialog-content { display: flex; flex-direction: column; }' +
  'button { margin: 10px; width: 50%; }'+
  'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']

})
export class DialogAddSearch {
  search: Search[] = [];
  filter: any;
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
      const newSearch = new Search();
      newSearch.filter = this.filter;
      console.log(newSearch)
      this.searchService
        .createSearch(newSearch)
        .subscribe((search: Search[]) => this.search = search);
  }
}

@Component({
  selector: 'dialog-add',
  template:
    '<h1 mat-dialog-title>Ajouter un filtre</h1>' +
    '<mat-form-field appearance="fill">\n' +
    '    <mat-label>Filter</mat-label>\n' +
    '    <input matInput [value]="" [(ngModel)]="filter">\n' +
    ' </mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '  <button mat-button mat-dialog-close>Annuler</button>' +
    '  <button mat-button (click)="updateSearch()" [mat-dialog-close]="filter" cdkFocusInitial>Modifier</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; }' +
  'mat-dialog-content { display: flex; flex-direction: column; }' +
  'button { margin: 10px; width: 50%; }'+
  'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']

})
export class DialogUpdateSearch {
  search: Search[] = [];
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
      const newSearch = new Search();
      newSearch.filter = this.filter;
      newSearch.id = this.data.id;
      console.log(newSearch)
      this.searchService
        .updateSearch(newSearch)
        .subscribe((search: Search[]) => this.search = search);
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
  'button { margin: 10px; width: 50%; }'+
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
  selector: 'dialog-add',
  template:
    '<h1 mat-dialog-title>Ajouter un type de contrat</h1>' +
    '<mat-form-field appearance="outline">\n' +
    '    <mat-label>Job Type</mat-label>\n' +
    '    <input matInput [(ngModel)]="jobtype">\n' +
    ' </mat-form-field>' +
    '<mat-dialog-actions align="center">' +
    '  <button mat-button mat-dialog-close>Annuler</button>' +
    '  <button mat-button (click)="addSearch()" [mat-dialog-close]="jobtype" cdkFocusInitial>Ajouter</button>' +
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; }' +
  'mat-dialog-content { display: flex; flex-direction: column; }' +
  'button { margin: 10px; width: 50%; }'+
  'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']

})
export class DialogAddJobType {
  jobType: JobType[] = [];
  jobtype: any;
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
    const newSearch = new JobType();
    newSearch.jobs = this.jobtype;
    console.log(newSearch)
    this.jobtypeService
      .createJobType(newSearch)
      .subscribe((jobtype: JobType[]) => this.jobtype = jobtype);
  }
}

@Component({
  selector: 'dialog-add',
  template:
    '<mat-form-field appearance="outline">'+
      '<mat-label>Titre</mat-label>'+
      '<input matInput [value]="joboffers.title" [(ngModel)]="joboffers.title">'+
    '</mat-form-field>'+
    '<mat-form-field appearance="outline">'+
      '<mat-label>Description</mat-label>'+
      '<textarea matInput [value]="joboffers.description" [(ngModel)]="joboffers.description" [rows]="20"></textarea>'+
    '</mat-form-field>'+
    '<mat-form-field appearance="outline">'+
    '<mat-label>Salaire</mat-label>'+
    '<input matInput [value]="joboffers.salaire" [(ngModel)]="joboffers.salaire">'+
    '</mat-form-field>'+
    '<mat-form-field appearance="outline">'+
    '<mat-label>Localisation</mat-label>'+
    '<input matInput [value]="joboffers.localisation" [(ngModel)]="joboffers.localisation">'+
    '</mat-form-field>'+
    '<mat-form-field appearance="outline">'+
    '<mat-label>Types</mat-label>'+
    '<input matInput [value]="joboffers.types" [(ngModel)]="joboffers.types">'+
    '</mat-form-field>'+
    '<mat-form-field appearance="outline">'+
    '<mat-label>Company Info</mat-label>'+
    '<input matInput [value]="joboffers.companyInfo" [(ngModel)]="joboffers.companyInfo">'+
    '</mat-form-field>'+
    '<mat-form-field appearance="outline">'+
    '<mat-label>Domain</mat-label>'+
    '<input matInput [value]="joboffers.domain" [(ngModel)]="joboffers.domain">'+
    '</mat-form-field>'+
    '<mat-form-field appearance="outline">'+
    '<mat-label>Date</mat-label>'+
    '<input matInput [value]="joboffers.isNew" [(ngModel)]="joboffers.isNew">'+
    '</mat-form-field>'+
    '<mat-dialog-actions align="center">'+
      '<button mat-button mat-dialog-close>Annuler</button>'+
      '<button mat-button (click)="updateJobOffer()" [mat-dialog-close]="joboffers" cdkFocusInitial>Modifier</button>'+
    '</mat-dialog-actions>',
  styles: ['mat-form-field { width: 100%; padding: 30px; }' +
  'mat-dialog-content { display: flex; flex-direction: column; }' +
  'button { margin: 10px; width: 50%; }'+
  'mat-dialog-actions { display: flex; flex-direction: row; justify-content: space-between; color: red; }']
})
export class DialogUpdateJobOffer {
  joboffers:  JobOffer | any = [];
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
    console.log(newJobOffer)
    this.jobofferService
      .updateJobOffer(newJobOffer)
      .subscribe(() => console.log('Job offer updated successfully.'));
  }
}
