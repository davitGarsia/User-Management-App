import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { ControlUsersService } from '../core/services/control-users.service';
import { DrawerService } from '../core/services/drawer.service';

@Component({
  selector: 'app-sidenav-form',
  templateUrl: './sidenav-form.component.html',
  styleUrls: ['./sidenav-form.component.css'],
})
export class SidenavFormComponent implements OnInit, OnDestroy {
  showFiller = false;
  error = false;

  private eventSubscription!: Subscription;

  @Input() events!: Observable<void>;

  constructor(
    private controlUsersService: ControlUsersService,
    private drawerService: DrawerService
  ) {}

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
        });
      });
    });
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
    roles: new FormArray([], Validators.required),
  });

  onSubmit() {
    if (this.userForm.invalid) return;

    const id = this.userForm.value.id;
    const status = (this.userForm.value.userStatus = 'Active' ? true : false);
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
