import { Component, OnInit } from '@angular/core';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {SavedMovieModel} from '../models/saved-movie.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {SavedMoviesService} from '../services/saved-movies.service';
import {Movie} from '../models/movie.model';

@Component({
  selector: 'app-my-watched-movies',
  templateUrl: './my-watched-movies.page.html',
  styleUrls: ['./my-watched-movies.page.scss'],
})
export class MyWatchedMoviesPage implements OnInit {

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

  //movies

  watchedMovies: Movie[];
  watchedMoviesSub: Subscription;


  constructor( private authService: AuthService,
               private alertController: AlertController,
               private router: Router,
               private watchedMoviesService: WatchedMoviesService,
               private savedMoviesService: SavedMoviesService,
               public alert: AlertController,
               private loadingCtrl: LoadingController ) {}

  ngOnInit() {
    this.watchedMoviesSub = this.watchedMoviesService.getMyWatchedMovies().subscribe((watchedMovies) => {
      this.watchedMovies = watchedMovies;
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
    this.watchedMoviesService.getMyWatchedMovies().subscribe(watchedMovies =>{
      console.log(watchedMovies);
    });
  }

  logout(): void {
    this.alertController.create({
      header: 'Log out',
      message: 'Are you sure zou want to log out?',
      buttons: [
        {
          text: 'Log out',
          handler: () => {
            console.log('Logged out');
            this.authService.logout();
            this.router.navigateByUrl("/log-in")

          }
        },
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {
            console.log('log out dismissed');
          }
        }
      ]
    }).then((alert)=>{
      alert.present();
    });
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

  openMyFriends(){
    this.router.navigateByUrl("/home/my-friends")
  }

  openMyProfile(){
    this.router.navigateByUrl("/home/my-profile")
  }
}
