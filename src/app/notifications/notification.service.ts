import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from '../user/users.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  user: any = {}
  private configs: any = [];
  private configs_subject$ = new BehaviorSubject<any>({});
  all_configs$ = this.configs_subject$.asObservable();
  
  private notifs: any = [];
  private notifs_subject$ = new BehaviorSubject<any>({});
  all_notifs$ = this.notifs_subject$.asObservable();

  constructor(private http: HttpClient, private userService: UsersService, private _router: Router) {
    this.userService.user_info$.subscribe(data => {
      this.user = data
    })
  }

  obtainConfigurationsData(){
    const headers = { 'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
    const body = {"username":this.user.username}
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/notifications/configurations', body, { headers }).subscribe(data => {
        this.configs = data
        this.configs_subject$.next(this.configs);
    })
  }

  createConfiguration(body:any){
    const headers = { 'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/notifications/configurations/new', body, { headers }).subscribe(() => {
        console.log("AQUI")
        this.obtainConfigurationsData()
    })
  }

  deleteConfig(body:any){
    const headers = { 'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/notifications/configurations/delete', body, { headers }).subscribe(() => {
      this.obtainConfigurationsData()
    })
  }

  obtainNotificationsData(){
    const headers = { 'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
    const body = {"username":this.user.username}
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/notifications', body, { headers }).subscribe(data => {
        this.notifs = data
        this.notifs_subject$.next(this.notifs);
    })
  }

}
