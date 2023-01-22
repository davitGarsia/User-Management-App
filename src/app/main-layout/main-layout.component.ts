import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, Subject } from 'rxjs';
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
  error = false;

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

  // fetchUsers(users: FindUser) {
  //   this.controlUsersService.getUsers(users).subscribe(({ data }) => {
  //     this.dataSource = data.entities;
  //     this.total = data.total;
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //   });
  // }

  fetchUsers(users: FindUser) {
    this.controlUsersService.getUsers(users).subscribe({
      next: ({ data }) => {
        this.dataSource = data.entities;
        this.total = data.total;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => (this.error = true),
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

  // Dialogue on delete

  openDialogue(row: any, e: any) {
    if (e.target.innerHTML == 'delete') {
      this.controlUsersService.userId.id = row.id;

      let dialogRef = this.dialog.open(DialogueComponent, {
        width: '500px',
        data: {
          firstName: row.firstName,
          lastName: row.lastName,
          id: row.id,
        },
      });
    }
  }

  emitToChild(id: any) {
    this.eventSubject.next(id);
  }

  // Sorting

  camelCase = (str: string) => {
    return str
      .replace(/\s(.)/g, (a: string) => {
        return a.toUpperCase();
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, (b: string) => {
        return b.toLowerCase();
      });
  };

  sortUsers(param: any) {
    const users = {
      search: '',
      sortBy: `${this.camelCase(param)}`,
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
