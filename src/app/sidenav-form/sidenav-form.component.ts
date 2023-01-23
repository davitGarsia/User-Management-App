import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { ControlUsersService } from '../core/services/control-users.service';
import { DrawerService } from '../core/services/drawer.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav-form',
  templateUrl: './sidenav-form.component.html',
  styleUrls: ['./sidenav-form.component.css'],
})
export class SidenavFormComponent implements OnInit, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  roleControl = new FormControl();
  filteredRoles!: Observable<string[]>;
  roles: string[] = [];
  allRoles: string[] = [];

  @ViewChild('roleInput') roleInput!: ElementRef<HTMLInputElement>;

  showFiller = false;
  error = false;

  private eventSubscription!: Subscription;

  @Input() events!: Observable<void>;

  constructor(
    private controlUsersService: ControlUsersService,
    private drawerService: DrawerService
  ) {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.roles.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.roleControl.setValue(null);
  }

  remove(role: string): void {
    const index = this.roles.indexOf(role);

    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.roles.push(event.option.viewValue);
    this.roleInput.nativeElement.value = '';
    this.roleControl.setValue(null);
  }
  //

  //

  filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.allRoles.filter((role) =>
      role.toLowerCase().includes(filterValue)
    );
  }

  ///
  ngOnInit() {
    this.eventSubscription = this.events.subscribe((id) => {
      this.drawerService.openDrawer();

      const users = {
        search: `${id}`,
        sortBy: 'email',
        sortDirection: 'asc',
        pageIndex: 0,
        pageSize: 5,
        includes: ['id', 'email', 'firstName', 'lastName', 'roles', 'locked'],
        excludes: [],
      };
      this.controlUsersService.getUsers(users).subscribe((res) => {
        this.userForm.patchValue({
          id: res.data.entities[0].id,
          firstName: res.data.entities[0].firstName,
          lastName: res.data.entities[0].lastName,
          email: res.data.entities[0].email,

          userStatus: res.data.entities[0].locked,
        });
        this.roles = res.data.entities[0].roles;
      });
    });

    const body = {
      typeId: 4,
      sortBy: 'name',
      sortDirection: 'asc',
      pageIndex: 0,
      pageSize: 50,
      includes: ['code', 'name'],
    };
    this.controlUsersService.getRoles(body).subscribe({
      next: ({ data }) =>
        data.entities.forEach((entity: any) => {
          this.allRoles = entity.name;
        }),
    });

    this.filteredRoles = this.roleControl.valueChanges.pipe(
      startWith(null),
      map((role: any) => (role ? this.filter(role) : this.allRoles.slice()))
    );
  }

  userForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    userStatus: new FormControl(null, Validators.required),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl(null, Validators.required),
    //roles: new FormControl(null, Validators.required),
  });

  onSubmit() {
    if (this.userForm.invalid) return;

    const id = this.userForm.value.id;
    const status = this.userForm.value.userStatus;
    const firstName = this.userForm.value.firstName;
    const email = this.userForm.value.email;
    const lastName = this.userForm.value.lastName;
    //const roles = this.userForm.get('roles')?.value;
    const roles = this.roles;

    const user = {
      id: id,
      firstName: firstName,
      email: email,
      lastName: lastName,
      roles: roles,
      locked: status,
    };

    this.controlUsersService.saveUser(user).subscribe({
      next: (res) => {
        if (res.success) {
          this.drawerService.closeDrawer();
        }
      },
      error: (err) => {
        this.error = err.error.message = 'User already exists' ? true : false;
      },
    });
  }

  get rolesArray() {
    return <FormArray>this.userForm.get('roles');
  }

  onAddRole() {
    this.rolesArray.push(new FormControl(''));
  }

  close() {
    this.drawerService.closeDrawer();
    this.userForm.reset();
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
