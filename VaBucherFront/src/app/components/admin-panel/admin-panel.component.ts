import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { JobOffer } from 'src/app/models/joboffer';
import { User } from 'src/app/models/user';
import { ApiDataService } from 'src/app/services/api-data.service';
import { JobofferService } from 'src/app/services/joboffer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  joboffers: JobOffer[] = [];
  data: any[] = [];

    @Input() user?: User;
    @Output() usersUpdated = new EventEmitter<User[]>();

  constructor(private userService:UserService,private jobofferService: JobofferService, private dataService: ApiDataService) {}

  ngOnInit(): void {
    interval(5000).subscribe(() => this.jobofferService
    .getJobOffer()
    .subscribe((result: JobOffer[]) => (this.joboffers = result)));
  this.dataService.currentData.subscribe(data => {
    this.data = data;
  });
  }

  updateUser(user: User) {
    this.userService
      .updateUser(user)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
  }

  deleteUser(user: User) {
    this. userService
      .deleteUser(user)
      .subscribe((users: User[]) => this.usersUpdated.emit(users));
  }

  createUser(user: User) {
    this.userService
      .createUser(user)
      .subscribe(
        // @ts-ignore
        (users: User[]) => this.usersUpdated.emit(users),
      );
  }

}
