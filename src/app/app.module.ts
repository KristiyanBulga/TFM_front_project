import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgApexchartsModule } from "ng-apexcharts"; 

import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ListRestaurantsComponent } from './list-restaurants/list-restaurants.component';
import { RestaurantInfoComponent } from './list-restaurants/restaurant-info/restaurant-info.component';
import { AutocompleteChipComponent } from './autocomplete-chip/autocomplete-chip.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListRestaurantsComponent,
    RestaurantInfoComponent,
    AutocompleteChipComponent
  ],
  imports: [
    NgApexchartsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatToolbarModule,
    MatGridListModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
