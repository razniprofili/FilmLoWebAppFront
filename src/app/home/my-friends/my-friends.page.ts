import { Component, OnInit } from '@angular/core';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {SavedMoviesService} from '../services/saved-movies.service';
import {FriendshipService} from '../services/friendship.service';
import {UserModel} from '../models/user.model';
import {FriendInfoComponent} from '../../components/friend-info/friend-info.component';
import {MatDialog} from '@angular/material/dialog';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {FriendRequestModel} from '../models/friend-request.model';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

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

  myRequestsSub: Subscription
  myRequests: FriendRequestModel[]

  userSub: Subscription

  empty

  private _hubConnection: HubConnection;

  constructor( private authService: AuthService,
               private alertController: AlertController,
               private router: Router,
               private watchedMoviesService: WatchedMoviesService,
               private savedMoviesService: SavedMoviesService,
               public alert: AlertController,
               private loadingCtrl: LoadingController,
               private friendshipService: FriendshipService,
               private matDialog: MatDialog,
               private snotifyService: SnotifyService) {}

  ngOnInit() {
    this.friendsSub = this.friendshipService.allMyFriends.subscribe((myFriends) => {
      myFriends.sort((a, b) => a.name.localeCompare(b.name))
      this.friends = myFriends;

      if(myFriends.length == 0) {
        this.empty = true
      } else {
        this.empty = false
      }
    });

    this.userSub = this.authService.currentUser.subscribe(user => {
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

    this.startSignalRConnection();
  }

  search(ev: any) {
    this.initialize();
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.friends = this.friends.filter((item) => {
        return (item.name.toLocaleLowerCase().indexOf(val.toLowerCase()) > -1 || item.surname.toLocaleLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  initialize() {
    this.friendshipService.allMyFriends.subscribe((friends) => {
      this.friends = friends;
    });

  }

  friendNameAsc(){
    this.friends.sort((a, b) => a.name.localeCompare(b.name))
  }

  friendNameDesc(){
    this.friends.sort((a, b) => b.name.localeCompare(a.name))
  }

  friendSurnameAsc(){
    this.friends.sort((a, b) => a.surname.localeCompare(b.surname))
  }

  friendSurnameDesc(){
    this.friends.sort((a, b) => b.surname.localeCompare(a.surname))
  }

  ionViewWillEnter(){
    this.friendshipService.getMyFriends().subscribe(myFriends =>{
      console.log(myFriends);
    });

    this.friendshipService.getMyRequests().subscribe((requests) => {
      console.log(requests)
    });

  }

  ngOnDestroy(){

    this.userSub.unsubscribe()
    this.myRequestsSub.unsubscribe()
    this.friendsSub.unsubscribe()

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

  openStatistics() {
    this.router.navigateByUrl("/home/statistics", { replaceUrl: true })
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

  openFilmLoUsersPage(){
    this.router.navigateByUrl("/home/filmlo-users", { replaceUrl: true })
  }

  openUserProfile() {
    this.router.navigateByUrl("/home/my-profile", { replaceUrl: true })
  }

  openHome() {
    this.router.navigateByUrl("/home", { replaceUrl: true });
  }

  openSearchApi(){
    this.router.navigateByUrl("/home/movie-ideas", { replaceUrl: true })

  }

  openSavedMoviesPage(){
    this.router.navigateByUrl("/home/my-saved-movies", { replaceUrl: true })
  }

  openWatchedMovies(){
    this.router.navigateByUrl("/home/my-watched-movies", { replaceUrl: true })
  }

}
