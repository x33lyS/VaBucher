import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { FormsModule } from '@angular/forms';
import { JobofferComponent } from './components/joboffer/joboffer.component';
import { HomeComponent } from './components/home/home.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { registrationComponent } from './components/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'registration', component: registrationComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AdminPanelComponent,
    JobofferComponent,
    HomeComponent,
    LoaderComponent,
    NavbarComponent,
    registrationComponent,
    DashboardComponent,
    SearchComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]

})
export class AppModule { }

export class AppRoutingModule { }
