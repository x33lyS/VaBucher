import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";



const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
