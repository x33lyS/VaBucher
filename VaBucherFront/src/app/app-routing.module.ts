import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfilComponent } from './components/profil/profil.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { JobofferCompareComponent } from './components/joboffer-compare/joboffer-compare.component';
import { AdminGuard } from './services/admin.guard';
import { AuthGuard } from './services/auth.guard';
import { UnAuthGuard } from './services/unauth.guard';




const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'registration', component: RegistrationComponent, canActivate: [UnAuthGuard]},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard]},
  { path: 'profil', component: ProfilComponent , canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard]},
  { path: 'compare', component: JobofferCompareComponent,  canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
