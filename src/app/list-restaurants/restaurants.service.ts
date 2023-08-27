import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestaurantList {
    private restaurants: any = []
    private restaurants_subject$ = new BehaviorSubject<any>({});
    all_restaurants$ = this.restaurants_subject$.asObservable();

    // private restaurantsCompare: any = []
    // private compare_subject$ = new BehaviorSubject<any>({});
    // compare_restaurants$ = this.restaurants_subject$.asObservable();

    getRestaurantsLength() {
        return this.restaurants.length
    }

    setRestaurantsData(data: any) {
        this.restaurants = data
    }

    getRestaurantsData(){
        this.restaurants_subject$.next(this.restaurants);
    }

    
    // getRestaurantsToCompare() {
    //     this.compare_subject$.next(this.restaurantsCompare);
    // }

    // addRestaurantToCompare(add_obj:any){
    //     this.restaurantsCompare.push(add_obj)
    //     this.compare_subject$.next(this.restaurantsCompare);
    // }

    // removeRestaurant(delete_obj:any){
    //     this.restaurantsCompare.forEach((element:any,index:any)=>{
    //         if(element.place_id==delete_obj.place_id) this.restaurantsCompare.splice(index,1);
    //     });
    //     this.compare_subject$.next(this.restaurantsCompare);
    // }

    // emptyRestaurantsCompare(){
    //     this.restaurantsCompare = []
    //     this.compare_subject$.next(this.restaurantsCompare);
    // }
}