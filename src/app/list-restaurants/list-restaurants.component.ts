import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

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
  public myObservable = new Subject<string>();
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

  constructor(private http: HttpClient) {
    this.myObservable.subscribe(val => {
      alert(val)
      this.dataSource = new MatTableDataSource(this.restaurants);
    })
  }

  ngOnInit(): void {
    const headers = { 'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
    this.http.get<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/combined', { headers }).subscribe(data => {
        console.log(data)
        data.map((obj: any) => {
          obj["pills"] = obj.scores.average
          return obj
        })
        this.restaurants = data
        console.log(this.restaurants)
        this.dataSource = new MatTableDataSource(this.restaurants);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
