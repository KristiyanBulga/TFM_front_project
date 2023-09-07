import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantInfoComponent } from '../restaurant-info/restaurant-info.component';

@Component({
  selector: 'app-two-restaurants',
  templateUrl: './two-restaurants.component.html',
  styleUrls: ['./two-restaurants.component.css']
})
export class TwoRestaurantsComponent implements OnInit {
  @ViewChildren(RestaurantInfoComponent) private _children!: QueryList<RestaurantInfoComponent>;
  place_id: any = ""
  restaurant_id: any = ""
  place_id2: any = ""
  restaurant_id2: any = ""

  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.place_id = this._route.snapshot.paramMap.get('place_id');
    this.restaurant_id = this._route.snapshot.paramMap.get('restaurant_id');
    this.place_id2 = this._route.snapshot.paramMap.get('place_id2');
    this.restaurant_id2 = this._route.snapshot.paramMap.get('restaurant_id2');
  }

  setMaxValues(){
    let aux_max_reviews_list: any[] = []
    let aux_max_position_list: any[] = []
    this._children.forEach(function (child) {
      let obj = child.get_max_values()
      aux_max_reviews_list.push(obj.aux_max_reviews)
      aux_max_position_list.push(obj.aux_max_position)
    }); 
    this._children.forEach(function (child) {
      child.update_graphs(Math.max(...aux_max_reviews_list), Math.max(...aux_max_position_list))
    }); 
  }
}
