import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {Movie} from '../../home/models/movie.model';
import {FriendMoviesComponent} from '../friend-movies/friend-movies.component';
import {FriendshipService} from '../../home/services/friendship.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {FriendRequestModel} from '../../home/models/friend-request.model';
import {UserModel} from '../../home/models/user.model';
import {MutualFriendsComponent} from '../mutual-friends/mutual-friends.component';

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
               private matDialog: MatDialog,
               private friendshipService: FriendshipService,
               private snotifyService: SnotifyService) { }

  friend = this.data.dataKey // recieved data is friend

  // notification     style = 'material';
      title = 'Done!';
      body = 'Movie added to saved movie list!';
      timeout = 3000;
      position: SnotifyPosition = SnotifyPosition.rightBottom;
      progressBar = true;
      closeClick = true;
      newTop = true;
      filterDuplicates = false;
      backdrop = -1;
      dockMax = 8;
      blockMax = 6;
      pauseHover = true;
      titleMaxLength = 15;
      bodyMaxLength = 80;

      myFriendInfo: FriendRequestModel = {
        userSenderId: 1,
        userRecipientId: 1,
        userSender: null,
        userRecipient: null,
        friendshipDate: String(new Date()),
        statusCodeID: 'A'
      }

  mutualFriends: UserModel[] = [{
    id: 0,
    name: 'user',
    surname: 'user',
    picture: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/close-up-of-white-cat-blink.jpg'
  }]

  ngOnInit() {

    this.moviesService.getMoviesFriend(this.friend.id).subscribe(movies => {
      console.log(movies)
      this.friendMovies = movies;
      this.countMovies = this.friendMovies.length;
    });

    this.friendshipService.getFriendInfo(this.friend.id).subscribe((friend)=> {
      this.myFriendInfo = friend;
    })

    this.friendshipService.getMutualFriends(this.friend.id).subscribe((mutFriends) => {
      this.mutualFriends = mutFriends
      console.log(mutFriends)
    });
  }

  getConfig(): SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax,
        // @ts-ignore
        filterDuplicates: this.filterDuplicates
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }

  getConfigError(): SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax,
        // @ts-ignore
        filterDuplicates: this.filterDuplicates
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: 0,
      showProgressBar: false,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }

  deleteFriend(){

    this.friendshipService.deleteFriend(this.friend.id).subscribe(() => {
          this.dialogRef.close();
          this.snotifyService.success("User deleted from friends list!", "Done", this.getConfig());
        },
        (error => {
          // uspesno = false;
          console.log(error)
          this.snotifyService.error("Error while deleting friend. Friend is not deleted!", "Error", this.getConfigError());
        }))
  }

  seeFriendMovies() {

    const sendingData = {
      'userName' : this.friend.name,
      'userSurname': this.friend.surname,
      //'friendMovies': this.friendMovies
      'userId': this.friend.id
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

  seeMutualFriends(){
      const dialogRef = this.matDialog.open(MutualFriendsComponent, {
        role: 'dialog',
        height: '500px',
        width: '500px',
        data: {
          dataKey: this.mutualFriends,
        }
      });
  }
}
