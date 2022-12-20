import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignupForm } from 'src/app/models/signup';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
form: SignupForm = new SignupForm();

@Input() user?: User;
@Input() signup?: SignupForm;
@Output() usersUpdated = new EventEmitter<User[]>();

constructor(private userService:UserService) {}

ngOnInit(): void {}


onSubmit() {
  console.log(this.form);
  // Envoyer les données du formulaire à un serveur ici...
}


validatePasswords() {
  return this.form.password === this.form.confirmPassword;
}

}
