import { Component, OnInit } from '@angular/core';
import { UsersService } from '../user/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any = {}
  user_logged: boolean = false

  constructor(private userService: UsersService, private _router: Router) {
    this.userService.user_info$.subscribe(data => {
      this.user = data
      this.user_logged = Object.keys(this.user).length !== 0
    })
  }

  ngOnInit(): void {
    this.userService.getUser()
    this.user_logged = Object.keys(this.user).length !== 0
  }

  logout(){
    this.userService.logout()
    this._router.navigate(['/restaurants']);
  }

}
