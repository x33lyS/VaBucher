import { Component, OnInit } from '@angular/core';
import { CurrentUser } from 'src/app/models/currentuser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  currentUser!: CurrentUser;
  editing: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  updateCurrentUser() {
    this.userService.updateUser(this.currentUser)
    .subscribe(data => {
    this.editing = false;
    localStorage.setItem('currentUser', JSON.stringify(data));
    });
    }
}
