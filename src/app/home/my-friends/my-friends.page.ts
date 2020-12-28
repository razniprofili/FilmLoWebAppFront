import { Component, OnInit } from '@angular/core';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {Movie} from '../models/movie.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {SavedMoviesService} from '../services/saved-movies.service';
import {FriendshipService} from '../services/friendship.service';
import {UserModel} from '../models/user.model';
import {WatchedMovieDetailsComponent} from '../../components/watched-movie-details/watched-movie-details.component';
import {FriendInfoComponent} from '../../components/friend-info/friend-info.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.page.html',
  styleUrls: ['./my-friends.page.scss'],
})
export class MyFriendsPage implements OnInit {

// div visibility

  disabled = false;
  homeVisibility = true // init
  searchApiVisibility = false

  notifications = 0

  // user

  currentUser: User;
  user: UserGet = {
    name: "User",
    surname: "User",
    picture: "https://forum.mikrotik.com/styles/canvas/theme/images/no_avatar.jpg"
  }

  //friends

  friends: UserModel[];
  friendsSub: Subscription;


  constructor( private authService: AuthService,
               private alertController: AlertController,
               private router: Router,
               private watchedMoviesService: WatchedMoviesService,
               private savedMoviesService: SavedMoviesService,
               public alert: AlertController,
               private loadingCtrl: LoadingController,
               private friendshipService: FriendshipService,
               private matDialog: MatDialog) {}

  ngOnInit() {
    this.friendsSub = this.friendshipService.getMyFriends().subscribe((myFriends) => {
      this.friends = myFriends;
    });

    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(user);
    });


    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
    });
  }

  ionViewWillEnter(){
    this.friendshipService.getMyFriends().subscribe(myFriends =>{
      console.log(myFriends);
    });
  }

  logout() {
    console.log('Logged out');
    this.authService.logout();
    this.router.navigateByUrl("/log-in")
  }

  openFriendDetails (friend: UserModel){
    const dialogRef = this.matDialog.open(FriendInfoComponent, {
      role: 'dialog',
      height: '500px',
      width: '500px',
      data: {
        dataKey: friend,
      }
    });
  }
  openUserProfile() {
    this.router.navigateByUrl("/home/my-profile")
  }

  openHome() {
    this.router.navigateByUrl("/home");
  }
  openSearchApi(){
    this.router.navigateByUrl("/home/movie-ideas")

  }

  openSavedMoviesPage(){
    this.router.navigateByUrl("/home/my-saved-movies")
  }

  openWatchedMovies(){
    this.router.navigateByUrl("/home/my-watched-movies")
  }

}
