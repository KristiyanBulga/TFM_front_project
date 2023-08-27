import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgApexchartsModule } from "ng-apexcharts"; 

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {ScrollingModule} from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ListRestaurantsComponent } from './list-restaurants/list-restaurants.component';
import { RestaurantInfoComponent } from './list-restaurants/restaurant-info/restaurant-info.component';
import { AutocompleteChipComponent } from './autocomplete-chip/autocomplete-chip.component';
import { OneRestaurantComponent } from './list-restaurants/one-restaurant/one-restaurant.component';
import { TwoRestaurantsComponent } from './list-restaurants/two-restaurants/two-restaurants.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListRestaurantsComponent,
    RestaurantInfoComponent,
    AutocompleteChipComponent,
    OneRestaurantComponent,
    TwoRestaurantsComponent
  ],
  imports: [
    NgApexchartsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatSortModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatGridListModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    ScrollingModule,
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
