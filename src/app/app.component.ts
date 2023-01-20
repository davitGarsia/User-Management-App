import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DrawerService } from './core/services/drawer.service';
import { ControlUsersService } from './core/services/control-users.service';

import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from './dialogue/dialogue.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'user-management-page';
  searchTerm = '';
  @ViewChild('f') userInput!: NgForm;
  showFiller = false;

  eventSubject: Subject<void> = new Subject<void>();

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
    'status',
    'actions',
  ];

  constructor(
    private controlUsersService: ControlUsersService,
    private drawerService: DrawerService,
    private dialog: MatDialog
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

  openDialogue(id: any, e: any) {
    if (e.target.innerHTML == 'delete') {
      this.controlUsersService.userId.id = id;

      let dialogRef = this.dialog.open(DialogueComponent, { width: '500px' });
    }
  }

  emitToChild(id: any) {
    this.eventSubject.next(id);
  }
}
