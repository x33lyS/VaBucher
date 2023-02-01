import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/models/currentuser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  currentUser!: CurrentUser;
  currentUserData: string | null | undefined;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.currentUserData = localStorage.getItem('currentUser');
    if (!this.currentUserData) {
      this.router.navigate(['/registration']);
    } else {
      this.currentUser = JSON.parse(this.currentUserData);
    }

  }
  updateCurrentUser() {
    this.userService.updateUser(this.currentUser)
      .subscribe(data => {
        localStorage.setItem('currentUser', JSON.stringify(data));
      });
  }
}
