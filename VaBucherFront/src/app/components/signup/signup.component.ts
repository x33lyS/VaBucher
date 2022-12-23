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

  @Input() user?: User;
  @Output() usersUpdated = new EventEmitter<User[]>();
  
  constructor(private userService: UserService, private _formBuilder: FormBuilder) { 

  this.signupform = this._formBuilder.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    email: ["", Validators.required],
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required],
    phone: ["", Validators.required],
    search: ["", Validators.required],
    location: ["", Validators.required],
  })
}


  ngOnInit(): void { }


  onSubmit() {
    this.user!.firstName = this.signupform.get('firstName')!.value;
    this.user!.lastName = this.signupform.get('lastName')!.value;
    this.user!.email = this.signupform.get('email')!.value;
    this.user!.password = this.signupform.get('password')!.value;
    this.user!.phone = this.signupform.get('phone')!.value;
    this.user!.search = this.signupform.get('search')!.value;
    this.user!.location = this.signupform.get('location')!.value;
    this.userService.createUser(this.user!).subscribe((result: User[]) => this.usersUpdated.emit(result));
  }


  validatePasswords() {
    return this.signupform.get('password')?.value === this.signupform.get('confirmPassword')?.value;
  }
  submit() {
    return this.signupform.valid && this.validatePasswords()
  }
}
