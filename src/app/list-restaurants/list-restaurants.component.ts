import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RestaurantList } from './restaurants.service';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UsersService } from '../user/users.service';
import * as L from 'leaflet';

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
export class ListRestaurantsComponent implements OnInit, AfterViewInit  {
  user: any = {}
  user_logged: boolean = false
  displayedColumns: string[] = ['restaurant_name', 'score_overall', 'symbol', 'services', 'actions'];
  headers: any = {'restaurant_name': 'Restaurante', 'score_overall': 'Puntuación media', 'symbol': 'Símbolo', 'services': 'Servicios', 'actions': 'Actions'}
  dataToDisplay: any = []
  dataSource = new MatTableDataSource(this.dataToDisplay);
  restaurants: any = [];
  filteredRestaurants: any[] = [];
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

  private map!: L.Map
  markers: L.Marker[] = []

  constructor(private restaurantService: RestaurantList, private _router: Router, private userService: UsersService) {
    this.userService.user_info$.subscribe(data => {
      this.user = data
      this.user_logged = Object.keys(this.user).length !== 0
    })
    this.restaurantService.all_restaurants$.subscribe(data => {
        this.restaurants = data
        this.dataSource = new MatTableDataSource(this.restaurants);
        this.setSortingStrategy();
        this.dataSource.sort = this.sort; 
        let list: any[] = []
        try {
          if (typeof(this.dataSource.filteredData) === 'object'){
            list = [...this.dataSource.filteredData.values()]
            this.filteredRestaurants = list
            this.markers.forEach(marker => this.map.removeLayer(marker));
            this.markers = []
            for (const restaurant of list) {
              const coords = JSON.parse((restaurant as any).location.replace("{", "{\"").replace("=", "\":").replace(", ", ", \"").replace("=", "\":"))
              this.markers.push(L.marker([coords.lat, coords.lng]).bindPopup(this.makeRestaurantPopup(restaurant)))
            };
            this.addMarkers();
            this.centerMap();
          }
        } catch (error) {}
    })
  }

  ngOnInit(): void {
    if (this.restaurantService.getRestaurantsLength() == 0){
      this.restaurantService.obtainRestaurantsData()
    }
    else this.restaurantService.getRestaurantsData()
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort; 
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = []
    this.filteredRestaurants = this.dataSource.filteredData.values() as any
    for (const restaurant of this.dataSource.filteredData.values()) {
      const coords = JSON.parse((restaurant as any).location.replace("{", "{\"").replace("=", "\":").replace(", ", ", \"").replace("=", "\":"))
      this.markers.push(L.marker([coords.lat, coords.lng]).bindPopup(this.makeRestaurantPopup(restaurant)))
    };
    this.addMarkers();
    this.centerMap();
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

  is_user_restaurant(restaurant_name:any){
    if (this.user_logged && this.user.restaurants.filter((rest: any) => rest.name == restaurant_name).length > 0) return true
    return false
  }

  get_property(restaurant:any, property: string){
    return restaurant ? restaurant[property] : "Desconocido"
  }

  get_property_child(restaurant:any, property: string, child: string){
    const parent = restaurant ? restaurant[property] : {};
    return parent ? parent[child] : "Desconocido"
  }

  // MAP VIEW /////////////////////////////////
  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
  }
  
  private addMarkers() {
    // Add your markers to the map
    this.markers.forEach(marker => marker.addTo(this.map));
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    
    // Fit the map view to the bounds
    this.map.fitBounds(bounds);
  }

  makeRestaurantPopup(data: any): string {
    return `` +
      `<b>${ data.restaurant_name }</b>` +
      `<div>Puntuación media: ${ data.scores.average }</div>`
  }
}
