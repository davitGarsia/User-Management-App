import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ControlUsersService } from '../core/services/control-users.service';
import { DrawerService } from '../core/services/drawer.service';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { FindUser } from '../core/interfaces/findUser';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
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

  fetchUsers(users: FindUser) {
    this.controlUsersService.getUsers(users).subscribe(({ data }) => {
      this.dataSource = data.entities;
      this.total = data.total;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getUsers() {
    const users = {
      search: '',
      sortBy: 'firstName',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };

    this.fetchUsers(users);
  }

  pageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getUsers();
  }

  searchUsers(term: any) {
    const users = {
      search: `${term}`,
      sortBy: 'email',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };
    this.fetchUsers(users);
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

  sortByName() {
    const users = {
      search: '',
      sortBy: 'firstName',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };

    this.fetchUsers(users);
  }

  sortByLastName() {
    const users = {
      search: '',
      sortBy: 'lastName',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };

    this.fetchUsers(users);
  }

  sortByMail() {
    const users = {
      search: '',
      sortBy: 'email',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };

    this.fetchUsers(users);
  }

  sortByStatus() {
    const users = {
      search: '',
      sortBy: 'locked',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };

    this.fetchUsers(users);
  }
}
