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

    

@Input() user?: User;
@Output() usersUpdated = new EventEmitter<User[]>();

constructor(private userService:UserService,private _formBuilder: FormBuilder) {}

signupform = this._formBuilder.group({
  firstName: [undefined, Validators.required],
  lastName: [null, Validators.required],
  email: [null, Validators.required],
  password: ['', Validators.required],
  confirmPassword: [null, Validators.required],
  filter: [null, Validators.required],
  phone: [null, Validators.required],
  search: [null, Validators.required],
  location: ['', Validators.required],
})


ngOnInit(): void {}


onSubmit() {
  // Envoyer les données du formulaire à un serveur ici...
}


 validatePasswords() {
  // console.log(this.signupform.get('password')?.value === this.signupform.get('confirmPassword')?.value);
  
  return this.signupform.get('password')?.value === this.signupform.get('confirmPassword')?.value && this.signupform.get('password')?.value !== null;
}
submit() {
  if (!this.signupform.valid) {
    console.log("valid");
    if (this.validatePasswords())
    {
      console.log(true);
      
    }
    
  } 
}

}