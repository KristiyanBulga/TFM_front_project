import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router'

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.css']
})
export class RestaurantInfoComponent implements OnInit {
  place_id: any = ""
  restaurant_id: any = ""
  trip_advisor_data: any = {
    score_overall: "-"
  }
  google_maps_data: any = {}
  restaurant_name = "Nombre del restaurante"

  @ViewChild("chart") chart!: ChartComponent ;
  public chartOptions: Partial<ChartOptions>;
  displayedColumns = ['key', 'trip_advisor', 'google_maps']
  stats = [{}]
  table_keys = ["score", "price"]
  restaurant_tags = ['Americano', 'Pizza', 'Italiano', 'Hamburguesa', 'Parking']
  tags_selected: string[] = []
  data = {
    "trip_advisor": {
      "score": 4.5,
      "price": "€-€€"
    },
  }
  
  constructor(private _route: ActivatedRoute, private http: HttpClient) {
    
    this.chartOptions = {
      series: [
        {
          name: "Puntuación media",
          data: [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5]
        },
        {
          name: "Puntuación",
          data: [4.4, 4.4, 4.6, 4.3, null, 4.7, 4]
        }
      ],
      chart: {
        height: 350,
        width: "100%",
        type: "line",
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Tendencia puntuación",
        align: "center"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23"
        ]
      }
    };
  }

  ngOnInit(): void {
    this.place_id = this._route.snapshot.paramMap.get('place_id');
    this.restaurant_id = this._route.snapshot.paramMap.get('restaurant_id');
    const headers = {'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
    const body = {"place_id":this.place_id, "restaurant_id":this.restaurant_id}
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/trip_advisor', body, { headers }).subscribe(data => {
        this.trip_advisor_data = data
        this.restaurant_name = data.name
        this.fulfill_table()
    })
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/google_maps', body, { headers }).subscribe(data => {
        this.google_maps_data = data
        this.fulfill_table()
    })
  }

  received_elements(list_elements: string[]) {
    this.tags_selected = list_elements
   }

  fulfill_table(): void {
    this.stats = [    
      {key: "Puntuación media", "trip_advisor": this.trip_advisor_data.score_overall, "google_maps": this.google_maps_data.score_overall},
      {key: "Símbolos precio", "trip_advisor": this.trip_advisor_data.symbol, "google_maps": this.google_maps_data.symbol},
    ]
  }

}
