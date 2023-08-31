import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = ""
  password: string = ""
  loading: boolean = false
  wrong: boolean = false

  constructor(private userService: UsersService, private _router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true
    this.wrong = false
    let status = this.userService.login(this.username, this.password)
    if (status == "Found"){
      this._router.navigate(['/restaurants']);
    }
    else{
      this.loading = false
      this.wrong = true
    }
  }

}
