import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";


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
  // @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private userService: UserService, private _formBuilder: FormBuilder, private router: Router,
              private toastr: ToastrService) {

  this.registrationform = this._formBuilder.group({
      firstName:['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      location: '',
      search: '',
      role: 1,
      cv: '',
      phone: ''
  })
}


  ngOnInit(): void {

  }


  onSubmit() {
    if (this.registrationform.valid) {
    const user = new User();
    user.firstName = this.registrationform.value.firstName;
    user.lastName = this.registrationform.value.lastName;
    user.email = this.registrationform.value.email;
    user.password = this.registrationform.value.password;
    user.location = this.registrationform.value.location;
    user.search = this.registrationform.value.search;
    user.role = this.registrationform.value.role;
    user.cv = this.registrationform.value.cv;
    user.phone = this.registrationform.value.phone;
    console.log(user);
    this.userService.createUser(user).subscribe(
      () => {
        // Traitement en cas de réussite, par exemple en redirigeant l'utilisateur vers une autre page
        this.router.navigate(['/dashboard']);
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
}
