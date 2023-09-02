import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {FloatLabelType} from '@angular/material/form-field';
import { FormBuilder, FormControl } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { UsersService } from 'src/app/user/users.service';

@Component({
  selector: 'app-notifications-configs',
  templateUrl: './notifications-configs.component.html',
  styleUrls: ['./notifications-configs.component.css']
})
export class NotificationsConfigsComponent implements OnInit {
  displayedColumns: string[] = ['restaurant', 'filter','action'];
  configurations: any = [];
  dataSource = new MatTableDataSource(this.configurations);
  creatingConfig: boolean = false
  list_nums: any = [...Array(365).keys()]
  restaurant = new FormControl()
  variable = new FormControl()
  condition = new FormControl()
  value = new FormControl()
  config = this._formBuilder.group({
    restaurant: this.restaurant,
    variable: this.variable,
    condition: this.condition,
    value: this.value,
  });
  user: any = {}

  constructor(private _formBuilder: FormBuilder, private notificationService: NotificationService, private userService: UsersService) {
    this.userService.user_info$.subscribe(data => {
      this.user = data
    })
    this.notificationService.all_configs$.subscribe(data => {
      this.configurations = data
      this.dataSource = new MatTableDataSource(this.configurations);
  })
  }

  ngOnInit(): void {
    this.notificationService.obtainConfigurationsData()
  }

  getFloatLabelValue(): FloatLabelType {
    return 'auto';
  }

  createConfig(){
    let rest_name = ""
    for (let i = 0; i < this.user.restaurants.length; i++) {
      if (this.user.restaurants[i].restaurant_id == this.restaurant.value) rest_name = this.user.restaurants[i].name
    }
      
    let body = {
      "username": this.user.username,
      "restaurant_id": this.restaurant.value,
      "restaurant_name": rest_name,
      "variable": this.variable.value,
      "condition": this.condition.value,
      "value": this.value.value
    }
    console.log(body)
    this.notificationService.createConfiguration(body)
    this.restaurant = new FormControl()
    this.variable = new FormControl()
    this.condition = new FormControl()
    this.value = new FormControl()
  }

  deleteConfig(timestamp:any){
    let body = {
      "username": this.user.username,
      "timestamp": timestamp
    }
    this.notificationService.deleteConfig(body)
  }

}
