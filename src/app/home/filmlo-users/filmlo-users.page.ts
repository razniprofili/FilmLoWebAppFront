import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Movie} from '../models/movie.model';
import {SavedMovieModel} from '../models/saved-movie.model';
import {MovieAPI} from '../models/movieAPI.model';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {AuthService, UserData} from '../../auth/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {SavedMoviesService} from '../services/saved-movies.service';
import {MatDialog} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {FriendshipService} from '../services/friendship.service';
import {UserModel} from '../models/user.model';
import {FriendInfoComponent} from '../../components/friend-info/friend-info.component';
import {UserInfoComponent} from '../../components/user-info/user-info.component';
import {FriendRequestModel} from '../models/friend-request.model';

@Component({
  selector: 'app-filmlo-users',
  templateUrl: './filmlo-users.page.html',
  styleUrls: ['./filmlo-users.page.scss'],
})
export class FilmloUsersPage implements OnInit {

  // div visibility
  disabled = false;
  homeVisibility = true // init
  searchApiVisibility = false

  // movies

  moviesSub: Subscription;
  savedMoviesSub: Subscription;
  friendsMovies: Movie[];
  savedMovies: SavedMovieModel[];
  moviesSearchApi: MovieAPI[];
  userSearchName: string;

  // user

  currentUser: User;
  user: UserGet = {
    name: "User",
    surname: "User",
    picture: "https://forum.mikrotik.com/styles/canvas/theme/images/no_avatar.jpg"
  }

  // other

  images: any[] = [
    'https://images-na.ssl-images-amazon.com/images/I/51DR2KzeGBL._AC_.jpg',
    'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg',
    'https://torange.biz/photofx/93/8/light-vivid-colors-fragment-love-background-rain-fall-cover-93412.jpg',
    'https://cdn.pixabay.com/photo/2017/07/18/18/24/dove-2516641_960_720.jpg',
    'https://c0.wallpaperflare.com/preview/956/761/225/5be97da101a3f.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9a/Swepac_FB_465%2C_RV70%2C_with_passing_lorry.jpg'
  ];
  empty = true
  notifications

  // for notifications:

  style = 'material';
  title = 'Success!';
  body = 'Movie removed from the list!';
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


  allUsers: UserModel[]
  resultusers: UserModel[] = new Array()
  filmLoUsersSub: Subscription;
  myRequestsSub: Subscription
  myRequests: FriendRequestModel[]

  constructor(private authService: AuthService,
              private alertController: AlertController,
              private router: Router,
              private watchedMoviesService: WatchedMoviesService,
              private savedMoviesService: SavedMoviesService,
              public alert: AlertController,
              private loadingCtrl: LoadingController,
              private snotifyService: SnotifyService,
              private matDialog: MatDialog,
              private friendshipService: FriendshipService) { }

  ngOnInit() {

    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(user);
    });


    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
    });

    this.filmLoUsersSub = this.friendshipService.getFilmLoUsers().subscribe((filmLoUsers) => {
      this.allUsers = filmLoUsers;
      console.log(this.allUsers)
    });

    // Other FilmLo users send me request:
    this.myRequestsSub = this.friendshipService.myRequests.subscribe( (myRequests) => {
      this.myRequests = myRequests;
      this.notifications = myRequests.length
    });

  }

  ionViewWillEnter(){
    console.log('izvrsen ion will enter')

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

  logout() {


    console.log('Logged out');
    this.authService.logout();
    this.router.navigateByUrl("/log-in")

  }

  searchFilmloUsers(form: NgForm) {
    const {searchName} = form.value;
console.log(this.allUsers[0].name.includes(this.userSearchName))
console.log(this.userSearchName)

    // if (searchName && searchName.trim() !== '') {
    //   this.resultusers = this.allUsers.filter((item) => {
    //     return (item.name.toLocaleLowerCase().indexOf(searchName.toLowerCase()) > -1);
    //   });
    // }

    this.resultusers = new Array()

    for(var i=0; i< this.allUsers.length; i++){
      if(this.allUsers[i].name.includes(this.userSearchName) || this.allUsers[i].surname.includes(this.userSearchName)) {
        this.resultusers.push(this.allUsers[i])
      }
    }

    if( this.resultusers.length == 0) {
      this.snotifyService.warning("No matches for " + this.userSearchName, "Warning", this.getConfigError());
    }

  }

  operUserDetails(user: UserModel){
    const dialogRef = this.matDialog.open(UserInfoComponent, {
      role: 'dialog',
      height: '400px',
      width: '500px',
      data: {
        dataKey: user,
      }
    });
  }
  // open div/page

  openFilmLoUsersPage(){
    this.router.navigateByUrl("/home/filmlo-users")
  }

  openHome() {

    this.router.navigateByUrl("/home")
  }

  openSearchApi(){
    this.searchApiVisibility = true;

    // and all others to false:
    this.homeVisibility = false
    this.router.navigateByUrl("/home/movie-ideas")
  }

  openSavedMoviesPage(){
    this.router.navigateByUrl("/home/my-saved-movies")
  }

  openWatchedMoviesPage(){
    this.router.navigateByUrl("/home/my-watched-movies")
  }

  openFilmLoFriendsPage(){
    this.router.navigateByUrl("/home/my-friends")
  }

  openUserProfile() {
    this.router.navigateByUrl("/home/my-profile")
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

}
