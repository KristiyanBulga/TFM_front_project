import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-one-restaurant',
  templateUrl: './one-restaurant.component.html',
  styleUrls: ['./one-restaurant.component.css']
})
export class OneRestaurantComponent implements OnInit {
  place_id: any = ""
  restaurant_id: any = ""

  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.place_id = this._route.snapshot.paramMap.get('place_id');
    this.restaurant_id = this._route.snapshot.paramMap.get('restaurant_id');
  }

}
