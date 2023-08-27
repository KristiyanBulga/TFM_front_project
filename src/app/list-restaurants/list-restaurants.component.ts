import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { RestaurantList } from './restaurants.service';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.component.html',
  styleUrls: ['./list-restaurants.component.css']
})
export class ListRestaurantsComponent implements OnInit {
  displayedColumns: string[] = ['restaurant_name', 'score_overall', 'symbol', 'services', 'actions'];
  headers: any = {'restaurant_name': 'Restaurante', 'score_overall': 'Puntuación media', 'symbol': 'Símbolo', 'services': 'Servicios', 'actions': 'Actions'}
  dataToDisplay: any = []
  dataSource = new MatTableDataSource(this.dataToDisplay);
  restaurants: any = [];
  services: any = {
    "wheelchair accessible entrance": {icon: "accessible", tooltip: "Acceso silla de ruedas"},
    "deliver": {icon: "local_shipping", tooltip: "Envio a domicilio"},
    "dine in": {icon: "table_restaurant", tooltip: "Comer dentro"},
    "reservable": {icon: "book_online", tooltip: "Reservable"},
    "serves beer": {icon: "sports_bar", tooltip: "Sirve cerveza"},
    "serves breakfast": {icon: "breakfast_dining", tooltip: "Desayuno"},
    "serves brunch": {icon: "brunch_dining", tooltip: "Almuerzo"},
    "serves dinner": {icon: "dinner_dining", tooltip: "Cena"},
    "serves lunch": {icon: "lunch_dining", tooltip: "Comida"},
    "serves vegetarian food": {icon: "ramen_dining", tooltip: "Comida vegetariana"},
    "serves wine": {icon: "wine_bar", tooltip: "Sirve vino"},
    "takeout": {icon: "takeout_dining", tooltip: "Para llevar"},
  }
  services_array: string[] = Object.keys(this.services)
  @ViewChild(MatSort, {static:true}) sort!: MatSort;

  selected_restaurants: any = []


  constructor(private http: HttpClient, private restaurantService: RestaurantList, private _router: Router) {
    this.restaurantService.all_restaurants$.subscribe(data => {
        this.restaurants = data
        this.dataSource = new MatTableDataSource(this.restaurants);
        this.setSortingStrategy();
        this.dataSource.sort = this.sort; 
    })
  }

  ngOnInit(): void {
    if (this.restaurantService.getRestaurantsLength() == 0){
      const headers = { 'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
      this.http.get<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/combined', { headers }).subscribe(data => {
          this.restaurants = data
          this.dataSource = new MatTableDataSource(this.restaurants);
          this.restaurantService.setRestaurantsData(data);
          this.setSortingStrategy()
          this.dataSource.sort = this.sort; 
      })
    }
    else this.restaurantService.getRestaurantsData()
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort; 
  }


  setSortingStrategy(){
    this.dataSource.sortingDataAccessor = (item:any, property) => {
      if (property === 'score_overall') {
        return item.scores.average;
      } else if (property === 'symbol') {
        return item.symbol.average;
      } else {
        return item[property];
      }
    };
  }


  select_restaurant(name:string, place_id:string, restaurant_id:string){
    if (this.selected_restaurants.length == 0){
      this.selected_restaurants.push({name, place_id, restaurant_id})
    }
    else{
      let place_id1 = this.selected_restaurants[0].place_id
      let restaurant_id1 = this.selected_restaurants[0].restaurant_id
      this.selected_restaurants = []
      this._router.navigate(['/restaurants/' + place_id1 + '/' + restaurant_id1 + '/' + place_id + '/' + restaurant_id]);
    }
  }

  cancel_compare(){
    this.selected_restaurants = []
  }

}
