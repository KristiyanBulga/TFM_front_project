import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';
const More = require('highcharts/highcharts-more');
More(Highcharts);
import Histogram from 'highcharts/modules/histogram-bellcurve';
Histogram(Highcharts);
const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);
const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);
const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);
const Wordcloud = require('highcharts/modules/wordcloud');
Wordcloud(Highcharts);


import {
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
  @Output() setMax: EventEmitter<any> = new EventEmitter();
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
  reviews_stats: any = {}
  reviews_stats_loaded: boolean = false

  max_words=30

  public base_config: Partial<ChartOptions>;
  public ta_score_chart_option: Partial<ChartOptions>;
  public gm_score_chart_option: Partial<ChartOptions>;
  public ta_position_chart_option: Partial<ChartOptions>;
  public ta_all_scores_chart_option: Partial<ChartOptions>;
  public ta_real_stats_chart_option: Partial<any>;
  public gm_real_stats_chart_option: Partial<any>;


  displayedColumns = ['key', 'trip_advisor', 'google_maps']
  // table_keys = ["score", "price"]
  // restaurant_tags = ['Americano', 'Pizza', 'Italiano', 'Hamburguesa', 'Parking']
  // tags_selected: string[] = []
  
  aux_max_reviews: any = 0
  aux_max_position: any = 0

  constructor(private http: HttpClient) {
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
    this.gm_score_chart_option = JSON.parse(JSON.stringify(this.base_config));
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
    this.ta_real_stats_chart_option = {
      series: [],
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px"
            },
            value: {
              fontSize: "16px"
            },
            total: {
              show: true,
              label: "Media",
              formatter: function(w:any) {
                let mean = 0
                for (let index = 0; index < w.config.labels.length; index++) {
                  mean += w.config.labels[index]/100 * w.config.series[index]
                }
                return mean.toFixed(2);
              }
            }
          }
        }
      },
      labels: []
    };
    this.gm_real_stats_chart_option = {...this.ta_real_stats_chart_option};
  }


  ngOnInit(): void {
    // this.place_id = this._route.snapshot.paramMap.get('place_id');
    // this.restaurant_id = this._route.snapshot.paramMap.get('restaurant_id');
    const headers = {'x-api-key': 'YixM9kMJrp5JIrOvNLgU38Vmsz8Qt3IF7xrxqndF'}
    const body = {"place_id":this.place_id, "restaurant_id":this.restaurant_id}
    this.http.post<any>('https://w6bsw6k9ea.execute-api.us-east-1.amazonaws.com/dev/data/trip_advisor', body, { headers }).subscribe(data => {
        this.trip_advisor_data = data
        this.restaurant_name = data.name
        this.trip_advisor_loaded = true
        this.fulfill_table()
        this.populate_graphs()
    })
    this.http.post<any>('https://w6bsw6k9ea.execute-api.us-east-1.amazonaws.com/dev/data/google_maps', body, { headers }).subscribe(data => {
        this.google_maps_data = data
        this.google_maps_loaded = true
        this.fulfill_table()
        this.populate_graphs()
    })
    this.http.post<any>('https://w6bsw6k9ea.execute-api.us-east-1.amazonaws.com/dev/reviews/historical', body, { headers }).subscribe(data => {
        this.reviews_historical = data
        this.reviews_historical_loaded = true
        this.populate_graphs()
    })
    this.http.post<any>('https://w6bsw6k9ea.execute-api.us-east-1.amazonaws.com/dev/reviews/stats', body, { headers }).subscribe(data => {
        this.reviews_stats = data
        this.reviews_stats_loaded = true
        this.populate_stats_graphs()
    })
    this.http.post<any>('https://w6bsw6k9ea.execute-api.us-east-1.amazonaws.com/dev/reviews/last', body, { headers }).subscribe(data => {
        this.last_reviews = data
        console.log(this.last_reviews)
    })
  }


  // received_elements(list_elements: string[]) {
  //   this.tags_selected = list_elements
  //  }


  fulfill_table(): void {
    if (this.trip_advisor_loaded && this.google_maps_loaded){
      this.main_stats = [    
        {key: "Puntuación media", "trip_advisor": this.trip_advisor_data.score_overall, "google_maps": this.google_maps_data.score_overall},
        {key: "Precio", "trip_advisor": this.trip_advisor_data.symbol, "google_maps": this.google_maps_data.symbol},
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


  populate_graphs(): void {
    if (this.trip_advisor_loaded && this.reviews_historical_loaded && this.google_maps_loaded && this.reviews_historical_loaded){
      this.aux_max_reviews = Math.max(Math.max(...this.reviews_historical.trip_advisor.counts), Math.max(...this.reviews_historical.google_maps.counts))
      let historical_data = this.trip_advisor_data.historical
      let count_data = historical_data.date.length
      this.ta_all_scores_chart_option.series = [
        {name: "Puntuación media", type: "line", data: Array(count_data-historical_data.score_overall.length).fill(null).concat(historical_data.score_overall)},
        {name: "Puntuación comida", type: "line", data: Array(count_data-historical_data.score_food.length).fill(null).concat(historical_data.score_food)},
        {name: "Puntuación servicio", type: "line", data: Array(count_data-historical_data.score_service.length).fill(null).concat(historical_data.score_service)},
        {name: "Puntuación calidad precio", type: "line", data: Array(count_data-historical_data.score_price_quality.length).fill(null).concat(historical_data.score_price_quality)},
        {name: "Puntuación atmósfera", type: "line", data: Array(count_data-historical_data.score_atmosphere.length).fill(null).concat(historical_data.score_atmosphere)},
      ]
      this.ta_all_scores_chart_option.title = {text: "Tendencia puntuaciaciones trip advisor",align: "left"}
      this.ta_all_scores_chart_option.xaxis = {categories: historical_data.date,title: {text: "Semana del año"},}

      this.ta_score_chart_option.series = [
        {name: "Núm comentarios", type: "column", data: this.reviews_historical.trip_advisor.counts},
        {name: "Puntuación diaria (comentarios)", type: "line", data: this.reviews_historical.trip_advisor.means},
        {name: "Puntuación media", type: "line", data: historical_data.score_overall},
      ]
      this.ta_score_chart_option.yaxis = [
        {opposite: true, title: {text: "Núm comentarios"}, min:0, labels: {formatter: function(val) {return val.toFixed(1);}}},
        {title: {text: "Puntuación"}, min:0, max:5, tickAmount: 5, labels: {formatter: function(val) {return val.toFixed(2);}}, show:false},
        {title: {text: "Puntuación"}, min:0, max:5, tickAmount: 5, labels: {formatter: function(val) {return val.toFixed(2);}}}
      ]
      this.ta_score_chart_option.title = {text: "Tendencia puntuación trip advisor",align: "left"}
      this.ta_score_chart_option.xaxis = {title: {text: "Semana del año"},}

      this.ta_position_chart_option.series = [
        {name: "Posición", type: "line", data: Array(count_data-historical_data.ranking.length).fill(null).concat(historical_data.ranking)},
      ]
      this.ta_position_chart_option.title = {text: "Ranking en trip advisor", align: "left"}
      this.ta_position_chart_option.xaxis = {categories: historical_data.date, title: {text: "Semana del año"},}

      let historical_data_gm = this.google_maps_data.historical
      this.gm_score_chart_option.series = [
        {name: "Núm comentarios", type: "column", data: this.reviews_historical.google_maps.counts},
        {name: "Puntuación diaria (comentarios)", type: "line", data: this.reviews_historical.google_maps.means},
        {name: "Puntuación media", type: "line", data: historical_data_gm.score_overall},
      ]
      this.gm_score_chart_option.xaxis = {type: 'datetime', title: {text: "Semana del año"},}
      this.gm_score_chart_option.yaxis = [
        {opposite: true, title: {text: "Núm comentarios"}, min:0, labels: {formatter: function(val) {return val.toFixed(1);}}},
        {title: {text: "Puntuación"}, min:0, max:5, tickAmount: 5, labels: {formatter: function(val) {return val.toFixed(2);}}, show:false},
        {title: {text: "Puntuación"}, min:0, max:5, tickAmount: 5, labels: {formatter: function(val) {return val.toFixed(2);}}}
      ]
      this.gm_score_chart_option.title = {text: "Tendencia puntuación google maps",align: "left"}

      this.aux_max_position = Math.max(...historical_data.ranking)
      this.setMax.emit()
    }
  }

  populate_stats_graphs(): void {
    if (this.reviews_stats_loaded){
      const rates = JSON.parse(this.reviews_stats.rates)
      const real_ta = rates["real"]["trip_advisor"] 
      const real_ta_total = real_ta['5']+real_ta['4']+real_ta['3']+real_ta['2']+real_ta['1']
      this.ta_real_stats_chart_option['series'] = [
        (real_ta['5']*100/real_ta_total).toFixed(2),
        (real_ta['4']*100/real_ta_total).toFixed(2),
        (real_ta['3']*100/real_ta_total).toFixed(2),
        (real_ta['2']*100/real_ta_total).toFixed(2),
        (real_ta['1']*100/real_ta_total).toFixed(2)]
      this.ta_real_stats_chart_option["labels"] = [5,4,3,2,1]

      const real_gm = rates["real"]["google_maps"] 
      const real_gm_total = real_gm['5']+real_gm['4']+real_gm['3']+real_gm['2']+real_gm['1']
      this.gm_real_stats_chart_option['series'] = [
        (real_gm['5']*100/real_gm_total).toFixed(2),
        (real_gm['4']*100/real_gm_total).toFixed(2),
        (real_gm['3']*100/real_gm_total).toFixed(2),
        (real_gm['2']*100/real_gm_total).toFixed(2),
        (real_gm['1']*100/real_gm_total).toFixed(2)]
      this.gm_real_stats_chart_option["labels"] = [5,4,3,2,1]
    }

    const features = JSON.parse(this.reviews_stats.features)
    let dataPositive: any[] = []
    const featuresPositives = Object.keys(features["positive"]).sort((a, b) => features["positive"][b] - features["positive"][a]).slice(0, this.max_words)
    for (const key of featuresPositives) {
      dataPositive.push({"name":key, weight: features["positive"][key]})
    }

    const options:Highcharts.Options = {
      accessibility: {
          screenReaderSection: {
              beforeChartFormat: '<h5>{chartTitle}</h5>' +
                  '<div>{chartSubtitle}</div>' +
                  '<div>{chartLongdesc}</div>' +
                  '<div>{viewTableButton}</div>'
          }
      },
      series: [{
          type: 'wordcloud',
          data: dataPositive,
          name: 'Ocurencias'
      }],
      title: {
          text: ''
      }
    };
    Highcharts.chart('positiveWords', options);

    let dataNegative: any[] = []
    const featuresNegatives = Object.keys(features["negative"]).sort((a, b) => features["negative"][b] - features["negative"][a]).slice(0, this.max_words)
    for (const key of featuresNegatives) {
      dataNegative.push({"name":key, weight: features["negative"][key]})
    }

    const optionsNegative:Highcharts.Options = {
      accessibility: {
          screenReaderSection: {
              beforeChartFormat: '<h5>{chartTitle}</h5>' +
                  '<div>{chartSubtitle}</div>' +
                  '<div>{chartLongdesc}</div>' +
                  '<div>{viewTableButton}</div>'
          }
      },
      series: [{
          type: 'wordcloud',
          data: dataNegative,
          name: 'Ocurencias'
      }],
      title: {
          text: ''
      }
    };
    Highcharts.chart('negativeWords', optionsNegative);
  }

  update_graphs(aux_max_reviews:any, aux_max_position:any){
    this.ta_score_chart_option.yaxis = [
      {opposite: true, title: {text: "Núm comentarios"}, min:0, max:aux_max_reviews, tickAmount:aux_max_reviews, labels: {formatter: function(val) {return val.toFixed(1);}}},
      {title: {text: "Puntuación"}, min:0, max:5, tickAmount: 5, labels: {formatter: function(val) {return val.toFixed(2);}}}
    ]
    this.gm_score_chart_option.yaxis = [
      {opposite: true, title: {text: "Núm comentarios"}, min:0, max:aux_max_reviews, tickAmount:aux_max_reviews, labels: {formatter: function(val) {return val.toFixed(1);}}},
      {title: {text: "Puntuación"}, min:0, max:5, tickAmount: 5, labels: {formatter: function(val) {return val.toFixed(2);}}}
    ]
    this.ta_position_chart_option.yaxis = [
      {title: {text: "Posición"}, min:0, max:aux_max_position, labels: {formatter: function(val) {return val.toFixed(1);}}}
    ]
  }

  get_max_values(){
    return {aux_max_reviews:this.aux_max_reviews, aux_max_position:this.aux_max_position}
  }

}
