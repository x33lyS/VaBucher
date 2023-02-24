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
  currentUserData: string | null | undefined;

  constructor(private userService: UserService,private authentificationService: AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.authentificationService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.currentUserData = sessionStorage.getItem('currentUser');
    if (this.currentUserData) {
      this.currentUser = JSON.parse(this.currentUserData);
    }
  }
  updateCurrentUser() {
    this.userService.updateUser(this.currentUser)
    .subscribe(data => {
      if (this.currentUserData) {
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      }
    });
  }
}
