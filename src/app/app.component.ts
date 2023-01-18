import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import {
  MatCellDef,
  MatRow,
  MatTableDataSource,
} from '@angular/material/table';
import { DrawerService } from './core/services/drawer.service';
import { ControlUsersService } from './core/services/control-users.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'user-management-page';
  searchTerm = '';
  @ViewChild('f') userInput!: NgForm;
  showFiller = false;
  id = '';

  total = 0;
  pageIndex = 0;
  pageSize = 5;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  displayedColumns: string[] = [
    'id',
    'first name',
    'last name',
    'email',
    'role',
    'active',
    'actions',
  ];

  constructor(
    private controlUsersService: ControlUsersService,
    private drawerService: DrawerService
  ) {}

  // Getting Users

  ngOnInit() {
    this.getUsers();

    this.drawerService.isDrawerOpen$.subscribe((res: boolean) => {
      if (res) {
        this.drawer.open();
      } else {
        this.drawer?.close();
      }
    });
  }

  getUsers() {
    const users = {
      search: '',
      sortBy: 'email',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };

    this.controlUsersService.getUsers(users).subscribe(({ data }) => {
      this.dataSource = data.entities;
      this.total = data.total;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  pageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getUsers();
  }

  ngAfterViewInit(): void {}

  applyFilter(term: any) {
    const users = {
      search: `${term}`,
      sortBy: 'email',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };
    this.controlUsersService.getUsers(users).subscribe(({ data }) => {
      this.dataSource = data.entities;
      this.total = data.total;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // getRow(row: any) {
  //   this.id = row.id;

  //   console.log(this.id);
  // }

  removeData(row: any) {
    this.id = row.id;
    const userId = {
      id: this.id,
    };
    console.log(userId);
    if (!this.id == null) {
      this.controlUsersService.deleteUser(userId).subscribe((res) => {
        console.log(res);
      });
    }
  }
}
