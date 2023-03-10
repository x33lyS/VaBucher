import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CurrentUser } from 'src/app/models/currentuser';
import { JobType } from 'src/app/models/jobtype';
import { JobtypeService } from 'src/app/services/jobtype.service';
import { SearchService } from 'src/app/services/search.service';
import { Search } from 'src/app/models/search';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationform: FormGroup;
  passwordValid = false;
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/;
  message: string | undefined;
  currentUser: CurrentUser | undefined;
  selectedJobTypes: any[]= [];
  jobtypes: JobType[] = [];
  selectedSearches:any[] = [];
  searches: Search[] = [];
  registrationUserStatus = false;

  // @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private authentService: AuthenticationService,private userService: UserService, private _formBuilder: FormBuilder, private router: Router,
    private searchService: SearchService,
    private jobtypeService: JobtypeService) {

    this.registrationform = this._formBuilder.group({
        firstname:['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        location: '',
        domain: '',
        jobtype: '',
        role: 1,
        cv: '',
        phone: '',
        staySignedIn: false
    })
  }

  ngOnInit(): void {
    this.jobtypeService
    .getJobType()
    .subscribe((result: JobType[]) => (this.jobtypes = result));
    this.searchService
    .getSearch()
    .subscribe((result: Search[]) => (this.searches = result));
  }
 
  onSubmit() {
    if (this.registrationform.valid) {
    const user = new User();
    user.firstname = this.registrationform.value.firstname;
    user.lastname = this.registrationform.value.lastname;
    user.email = this.registrationform.value.email;
    user.password = this.registrationform.value.password;
    if (user.location) {
    user.location = this.registrationform.value.location;
    }
    if (user.domain) {
    user.domain = this.registrationform.value.domain.join(',');
    }
    if (user.jobtype) {
    user.jobtype = this.registrationform.value.jobtype.join(',');
    }
    if (user.cv) {
    user.cv = this.registrationform.value.cv;
    }
    if (user.phone) {
    user.phone = this.registrationform.value.phone;
    }
    console.log(user);

    this.userService.createUser(user).subscribe(
      () => {
        // Traitement en cas de réussite, par exemple en redirigeant l'utilisateur vers une autre page
        this.authentService.login(user).subscribe({
          next: (result) => {
            localStorage.setItem('access_token', result.token);

            let currentUser = result.currentUser as unknown as CurrentUser;
            this.currentUser = currentUser;
            this.authentService.setCurrentUser(this.currentUser)
            if (this.registrationform.value.staySignedIn) {
              sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            this.router.navigate(['/dashboard']);

            // il faut protéger la route home aves un guard dans le futur pour ne pas pouvoir y accéder sans être connecté
          },
          error: (error) => {
            console.log("Erreur lors du login : Status " + error.status + ", " + error.error);
          }
        });
      },
      (error: string) => {
        // Traitement en cas d'erreur, par exemple en affichant un message d'erreur
        this.message = 'Un compte existe déjà avec cette adresse email';
      }
    );
  }
}

checkPassword() {
    return this.passwordValid = this.passwordRegex.test(this.registrationform.value.password);
  }


  validatePasswords() {
    const password = this.registrationform.value.password;
    const confirmPassword = this.registrationform.value.confirmPassword;
    return password === confirmPassword && password !== '' && confirmPassword !== '' && this.checkPassword() && password.length >= 8;
  }
  submit() {
    return this.registrationform.valid && this.validatePasswords()
  }

  switchRegistrationUserStatus = () => this.registrationUserStatus = !this.registrationUserStatus;

}
