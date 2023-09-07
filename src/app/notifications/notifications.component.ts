import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../user/users.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationComponent implements OnInit {
  user: any = {}
  user_logged: boolean = false
  selectedIndex = 0

  constructor(private _router: Router, private userService: UsersService) {
    this.userService.user_info$.subscribe(data => {
      this.user = data
      this.user_logged = Object.keys(this.user).length !== 0
    })
    if (this._router.url == "/notifications/configurations") this.selectedIndex=1
  }

  ngOnInit(): void { }

}
