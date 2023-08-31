import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'message'];
  notifications: any = [];
  dataToDisplay: any = [];
  dataSource = new MatTableDataSource(this.dataToDisplay);
  @ViewChild(MatSort, {static:true}) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.notifications = [
      {date: "2023/07/23", message:"[Telepizza] No se ha recibido ninguna review"},
      {date: "2023/07/17", message:"[L'arruz] La puntuación media de esta semana es inferior a 3.5"},
    ]
    this.dataSource = new MatTableDataSource(this.notifications);
    this.dataSource.sort = this.sort; 
  }

}
