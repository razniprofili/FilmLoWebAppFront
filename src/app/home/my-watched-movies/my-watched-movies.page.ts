import { Component, OnInit } from '@angular/core';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {SavedMoviesService} from '../services/saved-movies.service';
import {Movie} from '../models/movie.model';
import {WatchedMovieDetailsComponent} from '../../components/watched-movie-details/watched-movie-details.component';
import {MatDialog} from '@angular/material/dialog';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {FriendshipService} from '../services/friendship.service';
import {FriendRequestModel} from '../models/friend-request.model';

@Component({
  selector: 'app-my-watched-movies',
  templateUrl: './my-watched-movies.page.html',
  styleUrls: ['./my-watched-movies.page.scss'],
})
export class MyWatchedMoviesPage implements OnInit {

  // div visibility

  disabled = false;
  notifications = 0

  // user

  currentUser: User;
  user: UserGet = {
    name: "User",
    surname: "User",
    picture: "https://forum.mikrotik.com/styles/canvas/theme/images/no_avatar.jpg"
  }

  //movies

  watchedMovies: Movie[];
  watchedMoviesSub: Subscription;

  // for notifications:

  style = 'material';
  title = 'Snotify title!';
  body = 'Lorem ipsum dolor sit amet!';
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


  myRequests: FriendRequestModel[]
  myRequestsSub: Subscription

  constructor( private authService: AuthService,
               private alertController: AlertController,
               private router: Router,
               private watchedMoviesService: WatchedMoviesService,
               private savedMoviesService: SavedMoviesService,
               public alert: AlertController,
               private loadingCtrl: LoadingController,
               private matDialog: MatDialog,
               private snotifyService: SnotifyService,
               private friendshipService: FriendshipService) {}

  ngOnInit() {
    this.watchedMoviesSub = this.watchedMoviesService.myWatchedMovies.subscribe((myMovies) => {
      this.watchedMovies = myMovies;
    });

    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(user);
    });


    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
    });

    // Other FilmLo users send me request:
    this.myRequestsSub = this.friendshipService.myRequests.subscribe( (myRequests) => {
      this.myRequests = myRequests;
      this.notifications = myRequests.length
    });

  }

  ionViewWillEnter(){
    console.log('izvrsen ion will en ter watched')
    this.watchedMoviesService.getMyWatchedMovies().subscribe(watchedMovies =>{
      console.log(watchedMovies);
    });

    this.friendshipService.getMyRequests().subscribe((requests) => {
      console.log(requests)
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
  acceptRequest(userId: number){
    this.friendshipService.acceptRequest(userId).subscribe(()=> {
      this.snotifyService.success('Friend request accepted!', 'Done', this.getConfig());
    }, (error)=> {
      console.log(error)
      this.snotifyService.error("Error while accepting the request. Request is not accepted.", "Error", this.getConfigError());
    });
  }

  declineRequest(userId: number){
    this.friendshipService.declineRequest(userId).subscribe(()=> {
      this.snotifyService.success('Friend request declined!', 'Done', this.getConfig());
    }, (error)=> {
      console.log(error)
      this.snotifyService.error("Error while declining the request. Request is not declined.", "Error", this.getConfigError());
    });
  }
  logout() {


    console.log('Logged out');
    this.authService.logout();
    this.router.navigateByUrl("/log-in")

  }

  openMovieDetails(movieId: string){

    console.log(movieId)
    const dialogRef = this.matDialog.open(WatchedMovieDetailsComponent, {
      role: 'dialog',
      height: '720px',
      width: '500px',
      data: {
        dataKey: movieId,
      }
    });
  }

  openHome() {
    this.router.navigateByUrl("/home");
  }

  openSearchApi(){
    this.router.navigateByUrl("/home/movie-ideas")

  }
  openFilmLoUsersPage(){
    this.router.navigateByUrl("/home/filmlo-users")
  }

  openSavedMoviesPage(){
    this.router.navigateByUrl("/home/my-saved-movies")
  }

  openMyFriends(){
    this.router.navigateByUrl("/home/my-friends")
  }

  openMyProfile(){
    this.router.navigateByUrl("/home/my-profile")
  }
}
