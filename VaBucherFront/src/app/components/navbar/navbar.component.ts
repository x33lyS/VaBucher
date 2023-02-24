import { Component, OnInit, HostListener, Host } from '@angular/core';
import { interval } from 'rxjs';
import { CurrentUser } from 'src/app/models/currentuser';
import { AuthenticationService } from 'src/app/services/authentication.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser!: CurrentUser;

  constructor(private authentificationService: AuthenticationService) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let element = document.querySelector('.navbar') as HTMLElement;
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('navbar-inverse');
    } else {
      element.classList.remove('navbar-inverse');
    }
  }

  ngOnInit(): void {
    this.authentificationService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }

  disconnect() {
    this.authentificationService.logout();
    // setTimeout(() => {
    //   this.currentUser = localStorage.getItem('currentUser');
    // });
  }

}
