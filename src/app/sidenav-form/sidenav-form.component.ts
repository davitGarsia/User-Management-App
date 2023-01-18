import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlUsersService } from '../core/services/control-users.service';
import { DrawerService } from '../core/services/drawer.service';

@Component({
  selector: 'app-sidenav-form',
  templateUrl: './sidenav-form.component.html',
  styleUrls: ['./sidenav-form.component.css'],
})
export class SidenavFormComponent implements OnInit {
  showFiller = false;

  constructor(
    private controlUsersService: ControlUsersService,
    private drawerService: DrawerService
  ) {}

  ngOnInit() {}

  userForm: FormGroup = new FormGroup({
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

    this.controlUsersService.saveUser(user).subscribe((res) => {
      console.log(res);
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
  }
}
