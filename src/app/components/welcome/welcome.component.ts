import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<WelcomeComponent>) { }

 newUserName = this.data.dataKey.name

  ngOnInit() {
    console.log(this.data)
  }

  close(){
    this.dialogRef.close();
  }

}
