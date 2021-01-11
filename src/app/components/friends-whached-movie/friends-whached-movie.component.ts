import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FriendshipService} from '../../home/services/friendship.service';
import {CommentRateModel} from '../../home/models/comment-rate.model';
import {take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-friends-whached-movie',
  templateUrl: './friends-whached-movie.component.html',
  styleUrls: ['./friends-whached-movie.component.scss'],
})
export class FriendsWhachedMovieComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<FriendsWhachedMovieComponent>,
              private friendService: FriendshipService) { }


  disabled = false
  friendsData = this.data.dataKey

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }


}
