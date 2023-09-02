import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: any = [
    { username: "admin@gmail.es", password: "Admin" }, 
    { username: "propietario@gmail.es", password: "Propietario", restaurants: [
      {restaurant_id: "d985914", name:"Restaurante Nuestro Bar"}, 
      {restaurant_id:"d985909", name:"Restaurante Asador Concepción"}]}
  ];
  private current_user: any = {}
  private user_subject$ = new BehaviorSubject<any>({});
  user_info$ = this.user_subject$.asObservable();

  constructor() { }

  getUser() {
    this.user_subject$.next(this.current_user);
  }

  logout() {
    this.current_user = {}
    this.user_subject$.next(this.current_user);
  }

  login(username: string, password: string) {
    let res = this.users.filter((user: any) => user.username == username && user.password == password);
    if (res.length != 1) return "Not Found"
    else {
      this.current_user = res[0]
      this.user_subject$.next(this.current_user);
      return "Found"
    }
  }
}
