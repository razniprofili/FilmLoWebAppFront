import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Movie} from '../models/movie.model';
import {SavedMovieModel} from '../models/saved-movie.model';
import {MovieAPI} from '../models/movieAPI.model';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {FriendRequestModel} from '../models/friend-request.model';
import {AuthService} from '../../auth/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {SavedMoviesService} from '../services/saved-movies.service';
import {MatDialog} from '@angular/material/dialog';
import {FriendshipService} from '../services/friendship.service';
import {NgForm} from '@angular/forms';
import {FriendMovieDetailsComponent} from '../../components/friend-movie-details/friend-movie-details.component';
import {StatisticModel} from '../models/statistic.model';
import {StatisticService} from '../services/statistic.service';
import {PopularMovieModel} from '../models/popular-movie.model';
import {WatchedMovieDetailsComponent} from '../../components/watched-movie-details/watched-movie-details.component';
import * as CanvasJS from './canvasjs.min';
import {PopularMovieDetailsComponent} from '../../components/popular-movie-details/popular-movie-details.component';
import {YearStatisticModel} from '../models/year-statistic.model';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

// div visibility
  disabled = false;
  homeVisibility = true // init
  searchApiVisibility = false

  // movies


  savedMovies: SavedMovieModel[];
  moviesSearchApi: MovieAPI[];
  movieSearchName: string;
  countFriendMovies
  // user

  currentUser: User;
  user: UserGet = {
    name: "User",
    surname: "User",
    picture: "https://forum.mikrotik.com/styles/canvas/theme/images/no_avatar.jpg"
  }

  // other

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

  // for slider

  customOptions: any = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  myRequestsSub: Subscription
  myRequests: FriendRequestModel[]

  // statistic data:

  statistic: StatisticModel = {
    userId: 1,
    totalCount: 0,
    totalTime: 0,
    averageRate: 0
  }

  timeWatched: string
 // statistic: StatisticModel

  statSub: Subscription

  popularMovies: PopularMovieModel [] = [
    {
      userId: 1,
      movieName: "movieName",
      movieId: "id"
    }
  ]

  yearData: YearStatisticModel [] = [
    {
      userId: 1,
      year: "2020.",
      count: 1
    }
  ]

  i = 0

  displayedColumns: string[] = ['position', 'movieName', 'button'];
  data: {y: number, label: string}[]=[]

  private _hubConnection: HubConnection;
  userSub: Subscription

  constructor( private authService: AuthService,
               private alertController: AlertController,
               private router: Router,
               private watchedMoviesService: WatchedMoviesService,
               private savedMoviesService: SavedMoviesService,
               public alert: AlertController,
               private loadingCtrl: LoadingController,
               private snotifyService: SnotifyService,
               private matDialog: MatDialog,
               private friendshipService: FriendshipService,
               private statisticService: StatisticService,
               ) {}



  ngOnInit() {

    this.statisticService.getStatistic().subscribe((stat )=> {
      this.statistic = stat
      console.log('stat page data:')
      console.log(stat)
    })

    this.statisticService.getPopularMovies().subscribe((movies )=> {
      this.popularMovies = movies
      console.log(movies)
    })

    this.statisticService.getYearStatistic().subscribe((stats )=> {
      this.yearData = stats
      this.dataFormation(stats)

      // bar chart

      CanvasJS.addColorSet('customColorSet1', [ "#FF9A45"]);

      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        dataPointWidth: 50,
        colorSet: "customColorSet1",
        theme: 'dark2',
        title: {
          text: "Watched movies per year"
        },
        data: [{
          type: "column",
          dataPoints: this.data
        }]
      });

      chart.render();
    });

    this.userSub = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(user);
    });

    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
      console.log('user info home', user)
    });


    // Other FilmLo users send me request:
    this.myRequestsSub = this.friendshipService.myRequests.subscribe( (myRequests) => {
      this.myRequests = myRequests;
      this.notifications = myRequests.length
    });

    this.startSignalRConnection()

  }


  ionViewWillEnter(){
    console.log('ion will enter done')

    this.friendshipService.getMyRequests().subscribe((requests) => {
      console.log(requests)
    });

    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
      console.log('user info home', user)
    });

    this.statisticService.getStatistic().subscribe((stat )=> {
      console.log(stat)
    })

  }

  ngOnDestroy(){

    this.userSub.unsubscribe()
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

  dataFormation(stats: YearStatisticModel[]){
    for(var i=0; i< stats.length; i++){
        this.data.push({ y: stats[i].count, label: stats[i].year})
    }
  }

  openMovieDetails(movieId: string){
    const dialogRef = this.matDialog.open(PopularMovieDetailsComponent, {
      role: 'dialog',
      height: '720px',
      width: '500px',
      data: {
        dataKey: movieId,
      }
    });
  }

  timeConvert() {
    var num = this.statistic.totalTime;
    // var num = 1500
    var days = Math.floor(num/24/60)
    var hours = Math.floor(num/60%24)
    var minutes = Math.floor(num%60)

    if(days == 0) {
      if(minutes == 0){
        return  hours + ' hour(s)';
      } else {
        return  hours + ' hour(s)' + " " + minutes+ " minute(s)";
      }

    } else {
      if(minutes == 0){
        return days + " day(s)"+ " " + hours + ' hour(s)';
      } else {
        if(hours == 0){
          return days + " day(s)"+ ' '+ minutes+ " minute(s)";
        } else {
          return days + " day(s)"+ " " + hours + ' hour(s)'+ ' ' + minutes+ " minute(s)";
        }

      }

    }

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

  openHome() {
    this.router.navigateByUrl("/home", { replaceUrl: true })
  }

  openSearchApi(){
    this.router.navigateByUrl("/home/movie-ideas", { replaceUrl: true })
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

  openFilmLoUsersPage(){
    this.router.navigateByUrl("/home/filmlo-users", { replaceUrl: true })
  }

  openUserProfile() {
    this.router.navigateByUrl("/home/my-profile", { replaceUrl: true })
  }


}
