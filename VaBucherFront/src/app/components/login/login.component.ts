import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../models/user";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/models/currentuser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentUser: CurrentUser | undefined;


  signInForm: FormGroup<{ Email: FormControl; Password: FormControl; staySignedIn: FormControl; }> =
    this._formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]],
      staySignedIn: [false]
    });

  constructor(private authentService: AuthenticationService, private _formBuilder: FormBuilder, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      staySignedIn: [false]
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const user = new User();
      user.email = this.signInForm.value.Email;
      user.password = this.signInForm.value.Password;

      this.authentService.login(user).subscribe({
        next: (result) => {
          localStorage.setItem('access_token', result.token);

          let currentUser = result.currentUser as unknown as CurrentUser;
          this.currentUser = currentUser;
          this.authentService.setCurrentUser(this.currentUser)
          if (this.signInForm.value.staySignedIn) {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          }
          this.router.navigate(['/dashboard']);

          // il faut protéger la route home aves un guard dans le futur pour ne pas pouvoir y accéder sans être connecté
        },
        error: (error) => {
          console.log("Erreur lors du login : Status " + error.status + ", " + error.error);
        }
      });
    }
  }

}
