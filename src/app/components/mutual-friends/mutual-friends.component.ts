import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserData} from '../../auth/auth.service';

@Component({
  selector: 'app-mutual-friends',
  templateUrl: './mutual-friends.component.html',
  styleUrls: ['./mutual-friends.component.scss'],
})
export class MutualFriendsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<MutualFriendsComponent>) { }


  disabled = false
  mutualFriends = this.data.dataKey
  ngOnInit() {}


  close(){
    this.dialogRef.close();
  }
}
