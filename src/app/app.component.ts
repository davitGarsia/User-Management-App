import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Form,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { GetUsersService } from './core/services/get-users.service';
import { SaveUserService } from './core/services/save-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'first name',
    'last name',
    'email',
    'role',
    'status',
  ];
  dataSource!: MatTableDataSource<unknown>;

  title = 'user-management-page';

  showFiller = false;

  constructor(
    private saveUserService: SaveUserService,
    private GetUsersService: GetUsersService
  ) {
    //const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render
    //this.dataSource = new MatTableDataSource(users);
  }

  ////////////////
  // Getting Users

  ngOnInit() {
    const users = {
      search: '',
      sortBy: 'email',
      sortDirection: 'asc',
      pageIndex: 0,
      pageSize: 20,
      includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
      excludes: [],
    };
    this.GetUsersService.getUsers(users).subscribe((res) => {
      console.log(res);
      res.data.entities.forEach((entity: any) => {
        this.dataSource = new MatTableDataSource(entity);
      });
    });
  }

  //////////////////////

  userForm: FormGroup = new FormGroup({
    //userStatus: new FormControl(null, Validators.required),
    id: new FormControl(null),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl(null, Validators.required),
    roles: new FormArray([]),
  });

  onSubmit() {
    console.log(this.userForm.value);
    if (this.userForm.invalid) return;

    const id = this.userForm.value.id;
    const firstName = this.userForm.value.firstName;
    const email = this.userForm.value.email;
    const lastName = this.userForm.value.lastName;
    const roles = this.userForm.get('roles')?.value;

    const user = {
      id: id,
      firstName: firstName,
      email: email,
      lastName: lastName,
      roles: roles,
      locked: true,
    };

    this.saveUserService.saveUser(user).subscribe((res) => {
      console.log(res);
    });
  }

  get rolesArray() {
    return <FormArray>this.userForm.get('roles');
  }

  onAddRole() {
    this.rolesArray.push(new FormControl(''));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
//     ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
//     '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
//   };
// }
