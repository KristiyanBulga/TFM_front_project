import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestaurantList {
    private restaurants: any = [];
    private restaurants_subject$ = new BehaviorSubject<any>({});
    all_restaurants$ = this.restaurants_subject$.asObservable();
    rests: any = ["d4782515", "d16900983", "d999065", "d985914", "d7242894", "d985909", "d10915767"]

    // private restaurantsCompare: any = []
    // private compare_subject$ = new BehaviorSubject<any>({});
    // compare_restaurants$ = this.restaurants_subject$.asObservable();

    constructor(private http: HttpClient) { }

    getRestaurantsLength() {
        return this.restaurants.length
    }

    setRestaurantsData(data: any) {
        this.restaurants = data
    }

    moveToFirstPlace(arr:any, rests:any) {
        arr.map( (elem:any, index:any) => {
            if (rests.includes(elem.restaurant_id)) {
                arr.splice(index, 1);
                arr.splice(0, 0, elem);
        }
      })
        return arr;
    }
    

    obtainRestaurantsData(){
        const headers = { 'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
        this.http.get<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/combined', { headers }).subscribe(data => {
            this.restaurants = this.moveToFirstPlace(data, this.rests)
            this.restaurants_subject$.next(this.restaurants);
        })
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