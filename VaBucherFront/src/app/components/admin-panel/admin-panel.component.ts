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
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  animations: [
    trigger('deleteAnimation', [
      state('deleted', style({
        opacity: 0,
        transform: 'translateX(-100%)',
        display: 'none'
      })),
      transition('* => deleted', [
        animate('300ms ease-out')
      ])
    ]),
    trigger('addAnimation', [
      state('added', style({
        opacity: 1,
        transform: 'translateX(100%)'
      })),
      transition('* => added', [
        animate('300ms ease-out')
      ])
    ]),
  ]
})
export class AdminPanelComponent implements OnInit {

  joboffers: JobOffer[] = [];
  filteredJobOffers: JobOffer[] = [];
  filteredUser: User[] = [];
  filteredSearches: Search[] = [];
  filteredJobType: JobType[] = [];

  filter: string = '';
  users: User[] = [];
  search: Search[] = [];
  jobType: JobType[] = [];
  data: any[] = [];
  added: string = '';
  newJobType: JobType | undefined;
  @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private userService: UserService, private jobofferService: JobofferService,
    private dataService: ApiDataService,
    public dialog: MatDialog,
    private searchService: SearchService,
    private jobtypeService: JobtypeService,
              public toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.jobofferService
      .getJobOffer()
      .subscribe((result: JobOffer[]) => {
        this.joboffers = result
        this.filteredJobOffers = result;
      });
    this.dataService.currentData.subscribe(data => {
      this.data = data;
    });
    this.userService
      .getUser()
      .subscribe((result: User[]) => {
        this.users = result
        this.filteredUser = result;
      });
    this.searchService
      .getSearch()
      .subscribe((result: Search[]) => {
        this.search = result
        this.filteredSearches = result;
      });
    this.jobtypeService
      .getJobType()
      .subscribe((result: JobType[]) => {
        this.jobType = result
        this.filteredJobType = result;
      });
  }
  applyFilter(event: Event | KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement)?.value;
    this.filter = filterValue.toLowerCase();
    this.filteredJobOffers = this.joboffers.filter((joboffer) =>
      joboffer.title.toLowerCase().includes(this.filter) ||
      joboffer.description.toLowerCase().includes(this.filter) ||
      joboffer.salaire.toLowerCase().includes(this.filter) ||
      joboffer.localisation.toLowerCase().includes(this.filter) ||
      joboffer.types.toLowerCase().includes(this.filter) ||
      joboffer.companyInfo.toLowerCase().includes(this.filter) ||
      joboffer.domain.toLowerCase().includes(this.filter) ||
      joboffer.isNew.toLowerCase().includes(this.filter)
    );

    this.filteredUser = this.users.filter((user) =>
      user.firstname.toLowerCase().includes(this.filter) ||
      user.lastname.toLowerCase().includes(this.filter) ||
      user.email.toLowerCase().includes(this.filter) ||
      user.role.toString().toLowerCase().includes(this.filter)
    );
    this.filteredSearches = this.search.filter((search) =>
      search.filter.toLowerCase().includes(this.filter)
    );
    this.filteredJobType = this.jobType.filter((jobtype) =>
      jobtype.jobs.toLowerCase().includes(this.filter));


  }



  updateUser(user: User) {
    this.toastr.warning('Utilisateur modifié avec succès');
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
        user.state = 'deleted';
        this.userService
          .deleteUser(user)
          .subscribe((users: User[]) => this.usersUpdated.emit(users));
        this.toastr.error('Utilisateur supprimé avec succès');
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
    this.toastr.success('Utilisateur ajouté avec succès');
  }

  updateOffer(joboffer: JobOffer) {
    const dialogRef = this.dialog.open(DialogUpdateJobOffer, {
      width: '600px',
      height: '600px',
      data: joboffer
    });

    dialogRef.afterClosed().subscribe(result => {
      this.toastr.warning('Offre d\'emploi modifiée avec succès');
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
        joboffer.state = 'deleted';
        this.jobofferService
          .deleteJobOffer(joboffer)
          .subscribe((joboffers: JobOffer[]) => this.joboffers = joboffers);
        this.toastr.error('Offre d\'emploi supprimée avec succès');
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
        this.toastr.success('Recherche ajoutée avec succès');
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
      this.toastr.warning('Recherche modifiée avec succès');
    });
  }

  deleteSearch(search: Search) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '250px',
      data: { message: 'Etes-vous sûr de vouloir supprimer cette offre d\'emploi ?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        search.state = 'deleted';
        this.searchService
          .deleteSearch(search)
          .subscribe((search: Search[]) => this.search = search);
        this.toastr.error('Recherche supprimée avec succès');
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
        this.newJobType = result;
        this.jobtypeService
          .createJobType(result)
          .subscribe((jobType: JobType[]) => {
            this.jobType = jobType;
          });
        this.toastr.success('Type d\'emploi ajouté avec succès');
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
      this.toastr.warning('Type d\'emploi modifié avec succès');
    });
  }

  deleteJobType(jobType: JobType) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '250px',
      data: { message: 'Etes-vous sûr de vouloir supprimer cette offre d\'emploi ?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        jobType.state = 'deleted';
        this.jobtypeService
          .deleteJobType(jobType)
          .subscribe((jobType: JobType[]) => this.jobType = jobType);
        this.toastr.error('Type d\'emploi supprimé avec succès');
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
    '  <button mat-button mat-dialog-close>Annuler</button>' +
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
  search: Search = new Search();
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
    if (this.jobtypeTerm) {
      this.jobType.jobs = this.jobtypeTerm;
    }
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
