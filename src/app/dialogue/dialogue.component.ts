import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ControlUsersService } from '../core/services/control-users.service';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css'],
})
export class DialogueComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private controlUsersService: ControlUsersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  deleteUser() {
    this.controlUsersService
      .deleteUser(this.controlUsersService.userId)
      .subscribe((res) => {
        console.log(res);
      });
    this.dialogRef.close();
  }
}
