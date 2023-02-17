import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfilComponent } from './components/profil/profil.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';




const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'admin', component: AdminPanelComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
