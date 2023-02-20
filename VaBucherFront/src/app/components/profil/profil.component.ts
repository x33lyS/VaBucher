import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CurrentUser} from 'src/app/models/currentuser';
import {UserService} from 'src/app/services/user.service';
import {FormControl,Validators} from "@angular/forms";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  currentUser!: CurrentUser;
  passwordFormControl = new FormControl('',[
    Validators.required,
    Validators.minLength(6)
  ]);

  constructor(private userService: UserService,private router: Router) {
  }

  ngOnInit() {
    let currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) {
      this.router.navigate(['/registration']);
    } else {
      this.currentUser = JSON.parse(currentUserData);
    }
  }

  updateCurrentUser() {

    let newUser = this.currentUser;

    for (let key in newUser) {
      // @ts-ignore
      if (newUser[key] === null || newUser[key] === undefined || newUser[key] === '') {
        // @ts-ignore
        delete newUser[key];
      }
    }

    this.userService.updateUser(newUser).subscribe({
      next: (result) => {
    console.log(result, 'result');
    // TODO : Refactor le updateUser du Backend pour qu'il retourne le bon user
      }
    });
  }

}


