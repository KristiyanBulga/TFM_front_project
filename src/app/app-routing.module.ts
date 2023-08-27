import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ListRestaurantsComponent } from "./list-restaurants/list-restaurants.component";
import { OneRestaurantComponent } from "./list-restaurants/one-restaurant/one-restaurant.component";
import { TwoRestaurantsComponent } from "./list-restaurants/two-restaurants/two-restaurants.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
    { path: 'restaurants', component: ListRestaurantsComponent},
    { path: 'restaurants/:place_id/:restaurant_id', component: OneRestaurantComponent},
    { path: 'restaurants/:place_id/:restaurant_id/:place_id2/:restaurant_id2', component: TwoRestaurantsComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
  
  }
  