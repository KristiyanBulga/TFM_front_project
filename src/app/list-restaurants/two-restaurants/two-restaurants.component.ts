import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-two-restaurants',
  templateUrl: './two-restaurants.component.html',
  styleUrls: ['./two-restaurants.component.css']
})
export class TwoRestaurantsComponent implements OnInit {
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
}
