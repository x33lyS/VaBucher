import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {
  AdminPanelComponent,
  DialogAddSearch,
  DialogAddJobType,
  DialogContentExampleDialog, DialogUpdateJobOffer, DialogUpdateSearch, DialogUpdateJobType, DialogUpdateUser
} from './components/admin-panel/admin-panel.component';
import { FormsModule } from '@angular/forms';
import { JobofferComponent } from './components/joboffer/joboffer.component';
import { HomeComponent } from './components/home/home.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SearchComponent } from './components/search/search.component';
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FilterPipe } from './filter.pipe';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from './components/footer/footer.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoginComponent } from './components/login/login.component';
import { ProfilComponent } from './components/profil/profil.component';
import { JobofferDetailComponent } from './components/joboffer-detail/joboffer-detail.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FirstUppercasePipe } from './first-uppercase.pipe';
import { JobofferCompareComponent } from './components/joboffer-compare/joboffer-compare.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from "@angular/material/tabs";
import { ApiComponent } from './components/api/api.component';
import {MatChipsModule} from "@angular/material/chips"; // <--- Ajout de MatSnackBarModule


@NgModule({
  declarations: [
    AppComponent,
    AdminPanelComponent,
    JobofferComponent,
    HomeComponent,
    LoaderComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    SearchComponent,
    FilterPipe,
    FooterComponent,
    ProfilComponent,
    JobofferDetailComponent,
    DialogContentExampleDialog,
    DialogAddSearch,
    DialogAddJobType,
    DialogUpdateJobOffer,
    DialogUpdateSearch,
    DialogUpdateJobType,
    FirstUppercasePipe,
    JobofferCompareComponent,
    ApiComponent,
    DialogUpdateUser
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MatIconModule,
        FormsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        AppRoutingModule,
        MatAutocompleteModule,
        RouterModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTabsModule,
        MatChipsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

