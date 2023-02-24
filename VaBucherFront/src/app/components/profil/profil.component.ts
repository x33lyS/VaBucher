import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/models/currentuser';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  currentUser!: CurrentUser;

  constructor(private userService: UserService,private authentificationService: AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.authentificationService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }
  updateCurrentUser() {
    this.userService.updateUser(this.currentUser)
  }
}
