import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {FriendshipService} from '../../home/services/friendship.service';
import {UserModel} from '../../home/models/user.model';
import {Subscription} from 'rxjs';
import {FriendRequestModel} from '../../home/models/friend-request.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {FriendMoviesComponent} from '../friend-movies/friend-movies.component';
import {Movie} from '../../home/models/movie.model';
import {UserGet} from '../../auth/user-get.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<UserInfoComponent>,
      private moviesService: WatchedMoviesService,
      private matDialog: MatDialog,
      private friendshipService: FriendshipService,
      private snotifyService: SnotifyService
  ) { }

  // for notifications:

  style = 'material';
  title = 'Done!';
  body = 'Friend is deleted!';
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

  user = this.data.dataKey // recieved data is user

  sentRequest = false

  myFriend = false

  myRequest = false

  myfriends: UserModel[]

  friendsSub: Subscription;
  requestsSub: Subscription;
  myRequestsSub: Subscription

  mySentRequests: FriendRequestModel[]
  myRequests: FriendRequestModel[]

  //friendMovies: Movie []

   friendMovies: Movie [] = [{
    id: "string",
    actors: "string",
    year: 5,
    name: "string",
    director: "string",
    duration: 5,
    genre: "string",
    country: "string",
    rate: 5,
    comment: "string",
    dateTimeWatched: "string",
    dateTimeAdded:new Date(),
    poster: "string",
    user:new UserGet("name", "surname", "picture")
  }]

  ngOnInit() {

    this.friendsSub = this.friendshipService.getMyFriends().subscribe((myFriends) => {
      this.myfriends = myFriends;
      for(var i=0; i< myFriends.length; i++){
        if(myFriends[i].id == this.user.id) {
          this.myFriend = true;
          break;
        }
      }
    });

    this.requestsSub = this.friendshipService.getSentRequests().subscribe( (mySentRequests) => {
      this.mySentRequests = mySentRequests;
      for(var i=0; i< mySentRequests.length; i++){
        if(mySentRequests[i].userRecipientId == this.user.id) {
          this.sentRequest = true;
          break;
        }
      }
    });

    this.myRequestsSub = this.friendshipService.getMyRequests().subscribe( (myRequests) => {
      this.myRequests = myRequests;
      for(var i=0; i< myRequests.length; i++){
        if(myRequests[i].userSenderId == this.user.id) {
          this.myRequest = true;
          break;
        }
      }
    });






  }

  ionViewWillEnter(){
    this.friendshipService.getMyFriends().subscribe(myFriends =>{
      console.log(myFriends);
    });
  }

  respond() {

  }

  deleteFriend(){

    this.friendshipService.deleteFriend(this.user.id).subscribe(() => {
      this.dialogRef.close();
      this.snotifyService.success(this.body, this.title, this.getConfig());
    },
        (error => {
          // uspesno = false;
          console.log(error)
          this.snotifyService.error("Error while deleting friend. Friend is not deleted!", "Error", this.getConfigError());
        }))
  }

  sendFirendRequest(){

    this.friendshipService.sentFriendRequest(this.user.id).subscribe( () => {
      this.sentRequest = true;
    },
      (error => {
        // uspesno = false;
        console.log(error)
        this.snotifyService.error("Error while sending request. Request is not sent!", "Error", this.getConfigError());
        }));

  }

  viewFriendWatchMovies() {



    console.log(this.friendMovies)
    const sendingData = {
      'userName' : this.user.name,
      'userSurname': this.user.surname,
      'userId': this.user.id
     // 'friendMovies': this.friendMovies
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
}
