import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup<{ Email: FormControl; Password: FormControl; }> =
    this._formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]]
    });

  constructor(private authentService: AuthenticationService, private _formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {

      const user = new User();
      user.email = this.signInForm.value.Email;
      user.password = this.signInForm.value.Password;

      this.authentService.login(user).subscribe({
        next: (result) => {
          alert("Connected, token set dans le storage pour 30 minutes !");
          localStorage.setItem('access_token', result.token);
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
