import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject } from 'rxjs';
import { ControlUsersService } from '../core/services/control-users.service';
import { DrawerService } from '../core/services/drawer.service';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { FindUser } from '../core/interfaces/findUser';
import { ActivatedRoute, Router } from '@angular/router';

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
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Getting Users

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'];
      this.pageIndex = params['page'];
      this.pageSize = params['size'];
      this.persistData();
    });

    this.drawerService.isDrawerOpen$.subscribe((res: boolean) => {
      if (res) {
        this.drawer.open();
      } else {
        this.drawer?.close();
      }
    });
  }

  persistData() {
    const users = {
      search: this.searchTerm,
      sortBy: 'firstName',
      sortDirection: 'asc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };
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

  fetchUsers(users: FindUser) {
    this.controlUsersService
      .getUsers(users)
      .pipe(debounceTime(500))
      .subscribe({
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
      search: this.searchTerm,
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

    this.router.navigate(['.'], {
      queryParams: { page: this.pageIndex, size: this.pageSize },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
    this.persistData();
  }

  searchUsers(term: any) {
    this.router.navigate(['.'], {
      queryParams: { search: term, page: 0 },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
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
