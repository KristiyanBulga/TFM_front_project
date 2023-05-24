import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ListRestaurantsComponent } from "./list-restaurants/list-restaurants.component";
import { RestaurantInfoComponent } from "./list-restaurants/restaurant-info/restaurant-info.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/restaurants/test', pathMatch: 'full' },
    { path: 'restaurants', component: ListRestaurantsComponent},
    { path: 'restaurants/test', component: RestaurantInfoComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
  
  }
  