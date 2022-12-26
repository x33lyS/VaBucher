import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupform: FormGroup;
  passwordValid = false;
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/;

  // @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private userService: UserService, private _formBuilder: FormBuilder) {

  this.signupform = this._formBuilder.group({
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


  ngOnInit(): void { }


  onSubmit() {
    if (this.signupform.valid) {
    const user = new User();
    user.firstName = this.signupform.value.firstName;
    user.lastName = this.signupform.value.lastName;
    user.email = this.signupform.value.email;
    user.password = this.signupform.value.password;
    user.location = this.signupform.value.location;
    user.search = this.signupform.value.search;
    user.role = this.signupform.value.role;
    user.cv = this.signupform.value.cv;
    user.phone = this.signupform.value.phone;
    console.log(user);
    this.userService.createUser(user).subscribe((result: User[]) => this.usersUpdated.emit(result));
  }
}


  checkPassword() {
    return this.passwordValid = this.passwordRegex.test(this.signupform.value.password);
  }


  validatePasswords() {
    const password = this.signupform.value.password;
    const confirmPassword = this.signupform.value.confirmPassword;
    return password === confirmPassword && password !== '' && confirmPassword !== '' && this.checkPassword() && password.length >= 8;
  }
  submit() {
    return this.signupform.valid && this.validatePasswords()
  }
}
