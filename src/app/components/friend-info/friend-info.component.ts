import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {Movie} from '../../home/models/movie.model';
import {FriendMoviesComponent} from '../friend-movies/friend-movies.component';

@Component({
  selector: 'app-friend-info',
  templateUrl: './friend-info.component.html',
  styleUrls: ['./friend-info.component.scss'],
})
export class FriendInfoComponent implements OnInit {

  friendMovies: Movie []
  countMovies: number

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<FriendInfoComponent>,
               private moviesService: WatchedMoviesService,
               private matDialog: MatDialog) { }

  friend = this.data.dataKey // recieved data is friend

  ngOnInit() {

    this.moviesService.getMoviesFriend(this.friend.id).subscribe(movies => {
      console.log(movies)
      this.friendMovies = movies;
      this.countMovies = this.friendMovies.length;
    });
  }


  seeFriendMovies() {

    const sendingData = {
      'userName' : this.friend.name,
      'userSurname': this.friend.surname,
      'friendMovies': this.friendMovies
    }
    this.dialogRef.close();
    const dialogRef = this.matDialog.open(FriendMoviesComponent, {
      role: 'dialog',
      height: '900px',
      width: '1400px',
      data: {
        dataKey: sendingData
      }
    });
  }

}
