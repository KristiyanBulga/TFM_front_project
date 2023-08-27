import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router'

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
};

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.css']
})
export class RestaurantInfoComponent implements OnInit {
  @Input() place_id: any = ""
  @Input() restaurant_id: any = ""
  @Input() comparisson: boolean = false
  main_stats = [{}]
  schedule_data = [{}]
  trip_advisor_loaded: boolean = false
  trip_advisor_reviews_loaded: boolean = false
  trip_advisor_data: any = {}
  google_maps_loaded: boolean = false
  google_maps_reviews_loaded: boolean = false
  google_maps_data: any = {}
  restaurant_name = ""
  ta_schedule: any = {"lunes":"-", "martes":"-", "miércoles":"-", "jueves":"-", "viernes":"-", "sábado":"-", "domingo":"-"}
  gm_schedule: any = {"lunes":"-", "martes":"-", "miércoles":"-", "jueves":"-", "viernes":"-", "sábado":"-", "domingo":"-"}

  last_reviews: any = {}
  reviews_historical: any = {}
  reviews_historical_loaded: boolean = false

  public base_config: Partial<ChartOptions>;
  public ta_score_chart_option: Partial<ChartOptions>;
  public gm_score_chart_option: Partial<ChartOptions>;
  public ta_position_chart_option: Partial<ChartOptions>;
  public ta_all_scores_chart_option: Partial<ChartOptions>;


  displayedColumns = ['key', 'trip_advisor', 'google_maps']
  table_keys = ["score", "price"]
  restaurant_tags = ['Americano', 'Pizza', 'Italiano', 'Hamburguesa', 'Parking']
  tags_selected: string[] = []
  

  constructor(private _route: ActivatedRoute, private http: HttpClient) {
    this.base_config = {
      series: [],
      chart: {
        height: 350,
        width: "100%",
        type: "line",
        zoom: {enabled: true}
      },
      dataLabels: {enabled: false},
      stroke: {curve: "straight"},
      grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.3}},
      xaxis: {categories: [],title: {text: "Semana del año"}},
    };
    this.ta_score_chart_option = JSON.parse(JSON.stringify(this.base_config));
    this.ta_score_chart_option.yaxis = [
      {
        opposite: true,
        title: {text: "Núm comentarios"},
        min:0,
        labels: {formatter: function(val) {return val.toFixed(1);}}
      },
      {
        title: {text: "Puntuación"},
        min:0,
        max:5,
        tickAmount: 5,
        labels: {formatter: function(val) {return val.toFixed(2);}}
      }
    ]
    this.gm_score_chart_option = JSON.parse(JSON.stringify(this.base_config));
    this.gm_score_chart_option.yaxis = [
      {
        opposite: true,
        title: {text: "Núm comentarios"},
        min:0,
        labels: {formatter: function(val) {return val.toFixed(1);}}
      },
      {
        title: {text: "Puntuación"},
        min:0,
        max:5,
        tickAmount: 5,
        labels: {formatter: function(val) {return val.toFixed(2);}}
      }
    ]
    this.ta_position_chart_option = JSON.parse(JSON.stringify(this.base_config));
    this.ta_position_chart_option.yaxis = [
      {
        title: {text: "Posición"},
        min:0,
        labels: {formatter: function(val) {return val.toFixed(1);}}
      }
    ]
    this.ta_all_scores_chart_option = JSON.parse(JSON.stringify(this.base_config));
    this.ta_all_scores_chart_option.yaxis = [
      {
        title: {text: "Puntuación"},
        min:0,
        max:5,
        labels: {formatter: function(val) {return val.toFixed(2);}}
      }
    ]
  }


  ngOnInit(): void {
    // this.place_id = this._route.snapshot.paramMap.get('place_id');
    // this.restaurant_id = this._route.snapshot.paramMap.get('restaurant_id');
    const headers = {'x-api-key': 'NtNisN8Li5138tvAe57wf2tBr5oCQ7hK1N7zHidy'}
    const body = {"place_id":this.place_id, "restaurant_id":this.restaurant_id}
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/trip_advisor', body, { headers }).subscribe(data => {
        this.trip_advisor_data = data
        this.restaurant_name = data.name
        this.trip_advisor_loaded = true
        this.fulfill_table()
        this.trip_advisor_graphs()
    })
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/data/google_maps', body, { headers }).subscribe(data => {
        this.google_maps_data = data
        this.google_maps_loaded = true
        this.fulfill_table()
        this.google_maps_graphs()
    })
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/reviews/historical', body, { headers }).subscribe(data => {
        this.reviews_historical = data
        this.reviews_historical_loaded = true
        this.trip_advisor_graphs()
        this.google_maps_graphs()
    })
    this.http.post<any>('https://tst223j7a2.execute-api.us-east-1.amazonaws.com/dev/reviews/last', body, { headers }).subscribe(data => {
        this.last_reviews = data
        console.log(this.last_reviews)
    })
  }


  received_elements(list_elements: string[]) {
    this.tags_selected = list_elements
   }


  fulfill_table(): void {
    if (this.trip_advisor_loaded && this.google_maps_loaded){
      this.main_stats = [    
        {key: "Puntuación media", "trip_advisor": this.trip_advisor_data.score_overall, "google_maps": this.google_maps_data.score_overall},
        {key: "Símbolos precio", "trip_advisor": this.trip_advisor_data.symbol, "google_maps": this.google_maps_data.symbol},
        {key: "Sirve desayuno", "trip_advisor": this.trip_advisor_data.serves_breakfast ? "Si": "No", "google_maps": "No disponible"},
        {key: "Sirve almuerzo", "trip_advisor": this.trip_advisor_data.serves_brunch ? "Si": "No", "google_maps": "No disponible"},
        {key: "Sirve comida", "trip_advisor": this.trip_advisor_data.serves_lunch ? "Si": "No", "google_maps": this.google_maps_data.serves_lunch ? "Si": "No"},
        {key: "Sirve cena", "trip_advisor": this.trip_advisor_data.serves_dinner ? "Si": "No", "google_maps": this.google_maps_data.serves_dinner ? "Si": "No"},
      ]
      if ('schedule' in this.trip_advisor_data && 'lunes' in this.trip_advisor_data.schedule){
        this.ta_schedule = this.trip_advisor_data.schedule
      }
      if ('schedule' in this.google_maps_data && 'lunes' in this.google_maps_data.schedule){
        this.gm_schedule = this.google_maps_data.schedule
      }
      this.schedule_data = [
        {key: "Lunes", "trip_advisor": this.ta_schedule["lunes"], "google_maps": this.gm_schedule["lunes"]},
        {key: "Martes", "trip_advisor": this.ta_schedule["martes"], "google_maps": this.gm_schedule["martes"]},
        {key: "Miércoles", "trip_advisor": this.ta_schedule["miércoles"], "google_maps": this.gm_schedule["miércoles"]},
        {key: "Jueves", "trip_advisor": this.ta_schedule["jueves"], "google_maps": this.gm_schedule["jueves"]},
        {key: "Viernes", "trip_advisor": this.ta_schedule["viernes"], "google_maps": this.gm_schedule["viernes"]},
        {key: "Sábado", "trip_advisor": this.ta_schedule["sábado"], "google_maps": this.gm_schedule["sábado"]},
        {key: "Domingo", "trip_advisor": this.ta_schedule["domingo"], "google_maps": this.gm_schedule["domingo"]}
      ]
    }
  }


  trip_advisor_graphs(): void {
    if (this.trip_advisor_loaded && this.reviews_historical_loaded){
      let historical_data = this.trip_advisor_data.historical
      let count_data = historical_data.week.length
      this.ta_all_scores_chart_option.series = [
        {name: "Puntuación media", type: "line", data: Array(count_data-historical_data.score_overall.length).fill(null).concat(historical_data.score_overall)},
        {name: "Puntuación comida", type: "line", data: Array(count_data-historical_data.score_food.length).fill(null).concat(historical_data.score_food)},
        {name: "Puntuación servicio", type: "line", data: Array(count_data-historical_data.score_service.length).fill(null).concat(historical_data.score_service)},
        {name: "Puntuación calidad precio", type: "line", data: Array(count_data-historical_data.score_price_quality.length).fill(null).concat(historical_data.score_price_quality)},
        {name: "Puntuación atmósfera", type: "line", data: Array(count_data-historical_data.score_atmosphere.length).fill(null).concat(historical_data.score_atmosphere)},
      ]
      this.ta_all_scores_chart_option.title = {text: "Tendencia puntuaciaciones trip advisor",align: "left"}
      this.ta_all_scores_chart_option.xaxis = {categories: historical_data.week,title: {text: "Semana del año"},}

      this.ta_score_chart_option.series = [
        {name: "Núm comentarios", type: "column", data: Array(count_data-this.reviews_historical.trip_advisor.counts.length).fill(null).concat(this.reviews_historical.trip_advisor.counts)},
        {name: "Puntuación media", type: "line", data: Array(count_data-historical_data.score_overall.length).fill(null).concat(historical_data.score_overall)},
        {name: "Puntuación semanal (comentarios)", type: "line", data: Array(count_data-this.reviews_historical.trip_advisor.means.length).fill(null).concat(this.reviews_historical.trip_advisor.means)}
      ]
      this.ta_score_chart_option.title = {text: "Tendencia puntuación trip advisor",align: "left"}
      this.ta_score_chart_option.xaxis = {categories: historical_data.week,title: {text: "Semana del año"},}

      this.ta_position_chart_option.series = [
        {name: "Posición", type: "line", data: Array(count_data-historical_data.ranking.length).fill(null).concat(historical_data.ranking)},
      ]
      this.ta_position_chart_option.title = {text: "Ranking en trip advisor", align: "left"}
      this.ta_position_chart_option.xaxis = {categories: historical_data.week, title: {text: "Semana del año"},}
    }
  }


  google_maps_graphs(): void {
    if (this.google_maps_loaded && this.reviews_historical_loaded){
      let historical_data = this.google_maps_data.historical
      let count_data = historical_data.week.length
      this.gm_score_chart_option.series = [
        {name: "Núm comentarios", type: "column", data: Array(count_data-this.reviews_historical.google_maps.counts.length).fill(null).concat(this.reviews_historical.google_maps.counts)},
        {name: "Puntuación media", type: "line", data: Array(count_data-historical_data.score_overall.length).fill(null).concat(historical_data.score_overall)},
        {name: "Puntuación semanal (comentarios)", type: "line", data: Array(count_data-this.reviews_historical.google_maps.means.length).fill(null).concat(this.reviews_historical.google_maps.means)}
      ]
      this.gm_score_chart_option.title = {text: "Tendencia puntuación google maps",align: "left"}
      this.gm_score_chart_option.xaxis = {categories: historical_data.week, title: {text: "Semana del año"},}
    }
  }

}
