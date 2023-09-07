import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'restaurant', 'message'];
  notifications: any = [];
  dataSource = new MatTableDataSource(this.notifications);
  @ViewChild(MatSort, {static:true}) sort!: MatSort;

  constructor(private notificationService: NotificationService) {
    this.notificationService.all_notifs$.subscribe(data => {
      this.notifications = data
      this.dataSource = new MatTableDataSource(this.notifications);
      this.dataSource.sort = this.sort; 
  })
  }

  ngOnInit(): void {
    this.notificationService.obtainNotificationsData()
  }

}
