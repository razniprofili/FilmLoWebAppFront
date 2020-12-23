import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService, UserData} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../auth/user.model';
import {UserGet} from '../auth/user-get.model';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Movie} from './models/movie.model';
import {WatchedMoviesService} from './services/watched-movies.service';
import {MovieAPI} from './models/movieAPI.model';
import {SavedMovieModel} from './models/saved-movie.model';
import {SavedMoviesService} from './services/saved-movies.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {WatchedMovieDetailsComponent} from '../components/watched-movie-details/watched-movie-details.component';
import {FriendMovieDetailsComponent} from '../components/friend-movie-details/friend-movie-details.component';
import {MatDialog} from '@angular/material/dialog';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

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
  movieSearchName: string;

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
  notifications = 0

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


  constructor( private authService: AuthService,
               private alertController: AlertController,
               private router: Router,
               private watchedMoviesService: WatchedMoviesService,
               private savedMoviesService: SavedMoviesService,
               public alert: AlertController,
               private loadingCtrl: LoadingController,
               private snotifyService: SnotifyService,
               private matDialog: MatDialog) {}



  ngOnInit() {

    this.moviesSub = this.watchedMoviesService.allFiendsMovies.subscribe((allFiendsMovies) => {
      this.friendsMovies = allFiendsMovies;
    });

    // this.savedMoviesSub = this.savedMoviesService.allSavedMovies.subscribe((savedMovies) => {
    //   this.savedMovies = savedMovies;
    // });

    this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        console.log(user);
      });


    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
    });

    console.log(this.user)
   }

  ionViewWillEnter(){
    console.log('izvrsen ion will enter')
    this.watchedMoviesService.getMoviesForAllFriends().subscribe(friendsMovies =>{
      console.log(friendsMovies);
    });

    // this.savedMoviesService.getSavedMovies().subscribe(savedMovies =>{
    //   console.log(savedMovies);
    // });

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

  searchMovieAPI(form: NgForm) {

    const {searchName} = form.value;


      //ovde ide nasa fja:
      // tslint:disable-next-line:triple-equals
      if (this.movieSearchName != null && this.movieSearchName != ' ') {

        try {
          fetch('http://www.omdbapi.com/?s=' + this.movieSearchName.trim().toLowerCase() + '&type=movie&apikey=4a249f8d')
              .then(response => response.json())
              .then(res => {
                    this.moviesSearchApi = res.Search;
                    console.log(res);
                    if (res.Error === 'Movie not found!') {
                      //this.presentAlert('', 'Nema rezultata pretrage za ' + this.movieSearchName);
                      this.snotifyService.warning("No matches for " + this.movieSearchName, "Warning", this.getConfigError());
                    }
                    if (res.Error === 'Too many results.') {
                     // this.presentAlert('', 'Previše poklapanja, poboljšaj kriterijum pretrage!');
                      this.snotifyService.warning("Too many matches, improve your search criteria!", "Warning", this.getConfigError());
                    }
                  }

              );
        } catch (e) {
          console.log(e);
        }
      } else {

        //this.presentAlert('Greška', 'Moraš uneti naziv filma za pretragu!');
        this.snotifyService.error("You must enter movie name!", "Error", this.getConfigError());
      }

  }


  postMessage(form: NgForm): void {
    console.log("kliknuto")
    // const {message} = form.value;
    // this.postService.postMessage(message,
    //     `${this.user.firstName} ${this.user.lastName}`,
    //     {
    //       avatar: this.user.avatar,
    //       lastName: this.user.lastName,
    //       firstname: this.user.firstName
    //     },
    // );
    // form.resetForm();
  }

  logout() {


    console.log('Logged out');
    this.authService.logout();
    this.router.navigateByUrl("/log-in")

  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }


  // open div/page

  openMovieDetails(movie: Movie){

    console.log(movie)
    const dialogRef = this.matDialog.open(FriendMovieDetailsComponent, {
      role: 'dialog',
      height: '750px',
      width: '500px',
      data: {
        dataKey: movie,
      }
    });
  }

  openHome() {
    this.homeVisibility = true

    // and all others to false:
    this.searchApiVisibility = false;
  }

  openSearchApi(){
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
}
