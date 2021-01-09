import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Movie} from '../models/movie.model';
import {SavedMovieModel} from '../models/saved-movie.model';
import {MovieAPI} from '../models/movieAPI.model';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {AuthService} from '../../auth/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {SavedMoviesService} from '../services/saved-movies.service';
import {NgForm} from '@angular/forms';
import {MySavedMovieDetailsComponent} from '../../components/my-saved-movie-details/my-saved-movie-details.component';
import {MatDialog} from '@angular/material/dialog';
import {IdeaMovieDetailsComponent} from '../../components/idea-movie-details/idea-movie-details.component';
import {FriendshipService} from '../services/friendship.service';
import {FriendRequestModel} from '../models/friend-request.model';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

@Component({
  selector: 'app-movie-ideas',
  templateUrl: './movie-ideas.page.html',
  styleUrls: ['./movie-ideas.page.scss'],
})
export class MovieIdeasPage implements OnInit {

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

  myRequests: FriendRequestModel[]
  myRequestsSub: Subscription

  userSub: Subscription

  private _hubConnection: HubConnection;

  constructor( private authService: AuthService,
               private alertController: AlertController,
               private router: Router,
               private watchedMoviesService: WatchedMoviesService,
               private savedMoviesService: SavedMoviesService,
               public alert: AlertController,
               private loadingCtrl: LoadingController,
               private snotifyService: SnotifyService,
               private matDialog: MatDialog,
               private friendshipService: FriendshipService) {}



  ngOnInit() {


    this.savedMoviesSub = this.savedMoviesService.allSavedMovies.subscribe((savedMovies) => {
      this.savedMovies = savedMovies;
    });

    this.userSub = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(user);
    });


    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
    });

    console.log(this.user)

    // Other FilmLo users send me request:
    this.myRequestsSub = this.friendshipService.myRequests.subscribe( (myRequests) => {
      this.myRequests = myRequests;
      this.notifications = myRequests.length
    });

    this.startSignalRConnection()
  }

  ionViewWillEnter(){
    console.log('izvrsen ion will enter')
    this.watchedMoviesService.getMoviesForAllFriends().subscribe(friendsMovies =>{
      console.log(friendsMovies);
    });

    this.savedMoviesService.getSavedMovies().subscribe(savedMovies =>{
      console.log(savedMovies);
    });

    this.friendshipService.getMyRequests().subscribe((requests) => {
      console.log(requests)
    });

  }

  ngOnDestroy(){
    console.log('ngOnDestroy')
    this.userSub.unsubscribe()
    this.savedMoviesSub.unsubscribe()
    this.myRequestsSub.unsubscribe()

    this._hubConnection.stop()
        .then(() => console.log('Connection STOPPED'))
        .catch((err) => console.log('Error while stopping SignalR connection: ' + err));
  }

  startSignalRConnection(){
    this._hubConnection = new HubConnectionBuilder()
        .withUrl('https://localhost:44397/sendRequest')
        .build();

    this._hubConnection.on('RequestReceived', (friendship) => {
      console.log('userRecipientId: ', friendship)
      if(this.currentUser.id == friendship.userRecipientId) {
        console.log('Friend request successfully Received!');
        // Other FilmLo users send me request:
        this.friendshipService.getMyRequests().subscribe((requests) => {
          console.log(requests)
          this.myRequests = requests;
          this.notifications = requests.length
        });
        this.snotifyService.info('You received friend request from '+ friendship.userSender.name + ' '+ friendship.userSender.surname+'!', '', this.getConfig());
      }
    });

    this._hubConnection.start()
        .then(() => console.log('Connection started'))
        .catch((err) => console.log('Error while establishing SignalR connection: ' + err));
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

  async presentAlert(title: string, content: string) {
    const alert = await this.alert.create({
      header: title,
      message: content,
      buttons: ['OK']
    });

    await alert.present();
  }


  logout() {


            console.log('Logged out');
            this.authService.logout();
            this.router.navigateByUrl("/log-in")

  }


  // open div/page

  openFilmLoUsersPage(){
    this.router.navigateByUrl("/home/filmlo-users", { replaceUrl: true })
  }

  openHome() {

    this.router.navigateByUrl("/home", { replaceUrl: true })
  }

  openSearchApi(){
    this.searchApiVisibility = true;

    // and all others to false:
    this.homeVisibility = false

  }

  openStatistics() {
    this.router.navigateByUrl("/home/statistics", { replaceUrl: true })
  }

  openSavedMoviesPage(){
    this.router.navigateByUrl("/home/my-saved-movies", { replaceUrl: true })
  }

  openWatchedMoviesPage(){
    this.router.navigateByUrl("/home/my-watched-movies", { replaceUrl: true })
  }

  openFilmLoFriendsPage(){
    this.router.navigateByUrl("/home/my-friends", { replaceUrl: true })
  }

  openUserProfile() {
    this.router.navigateByUrl("/home/my-profile", { replaceUrl: true })
  }

  openMovieDetails(movieId: string){

    console.log(movieId)
    const dialogRef = this.matDialog.open(IdeaMovieDetailsComponent, {
      role: 'dialog',
      height: '730px',
      width: '500px',
      data: {
        dataKey: movieId,
      }
    });
  }
}
