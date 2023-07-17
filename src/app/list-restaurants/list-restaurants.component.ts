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
  displayedColumns: string[] = ['restaurant_name', 'ta_score_overall', 'gm_score_overall', 'ta_symbol', 'gm_symbol', 'gm_wheelchair_accessible_entrance'];
  headers: any = {'restaurant_name': 'Restaurante', 'ta_score_overall': 'Puntuación trip advisor', 'gm_score_overall': 'Puntuación google maps', 'ta_symbol': 'Precio trip advisor', 'gm_symbol': 'Precio google maps', 'gm_wheelchair_accessible_entrance': 'Acceso silla de ruedas'}
  dataToDisplay: any = []
  dataSource = new MatTableDataSource(this.dataToDisplay);
  restaurants: any = [];

  constructor(private http: HttpClient) {
    this.myObservable.subscribe(val => {
      alert(val)
      this.dataToDisplay = [{"position": "100", "name": 'Hydrogen', "weight": "1.0079", "symbol": 'H'}]
      this.dataSource = new MatTableDataSource(this.restaurants);
    })
  }

  ngOnInit(): void {
    const headers = { 'x-api-key': 'eW9h5iOhqqaFm3iTRkw7U6BIH7G740Cj8YeMrpKe'}
    this.http.get<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/combined', { headers }).subscribe(data => {
        console.log(data)
        this.restaurants = data
        this.dataSource = new MatTableDataSource(this.restaurants);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
