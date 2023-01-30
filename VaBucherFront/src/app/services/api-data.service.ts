import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  private dataSource = new BehaviorSubject([]);
  currentData = this.dataSource.asObservable();

  constructor() { }

  updateData(data: any) {
    this.dataSource.next(data);
  }
}
