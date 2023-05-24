import { Component, OnInit, ViewChild } from '@angular/core';

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
  @ViewChild("chart") chart!: ChartComponent ;
  public chartOptions: Partial<ChartOptions>;
  displayedColumns = ['key', 'trip_advisor', 'google_maps', 'verema']
  stats = [
    {key: "Puntuación", "trip_advisor": 4.5, "google_maps": 4.6, "verema": 4.3},
    {key: "Precio", "trip_advisor": '€€-€€€', "google_maps":"€€-€€€"},
  ]
  table_keys = ["score", "price"]
  restaurant_tags = ['Americano', 'Pizza', 'Italiano', 'Hamburguesa', 'Parking']
  tags_selected: string[] = []
  data = {
    "trip_advisor": {
      "score": 4.5,
      "price": "€-€€"
    },
  }
  
  constructor() {
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
  }

  received_elements(list_elements: string[]) {
    this.tags_selected = list_elements
   }

}
