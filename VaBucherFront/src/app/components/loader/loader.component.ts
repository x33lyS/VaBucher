import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public isVisible: boolean = true;

  constructor() {
    timer(1200).subscribe(() => {
      this.isVisible = false;
    });
  }
  ngOnInit(): void {
  }
}
