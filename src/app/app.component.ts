import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'user-management-page';

  userForm!: FormGroup;
  showFiller = false;

  constructor() {}

  ngOnInit() {
    this.userForm = new FormGroup({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]),
      userStatus: new FormControl(null, Validators.required),
      id: new FormControl(null),
      roles: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    console.log(this.userForm);
  }
}
