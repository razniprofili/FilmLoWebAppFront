import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {MovieAPIdetails} from '../../home/models/movieAPIdetails.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AlertController} from '@ionic/angular';
import {SavedMoviesService} from '../../home/services/saved-movies.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {WatchedMovieDetailsComponent} from '../watched-movie-details/watched-movie-details.component';
import {AddWatchedMovieComponent} from '../add-watched-movie/add-watched-movie.component';
import {Subscription} from 'rxjs';
import {FriendshipService} from '../../home/services/friendship.service';
import {UserData} from '../../auth/auth.service';
import {UserModel} from '../../home/models/user.model';
import {MutualFriendsComponent} from '../mutual-friends/mutual-friends.component';
import {TooltipPosition} from '@angular/material/tooltip';
import {FriendsWhachedMovieComponent} from '../friends-whached-movie/friends-whached-movie.component';
import {CommentRateModel} from '../../home/models/comment-rate.model';
import {FriendDataModel} from '../../home/models/friend-data.model';


@Component({
  selector: 'app-idea-movie-details',
  templateUrl: './idea-movie-details.component.html',
  styleUrls: ['./idea-movie-details.component.scss'],
})

export class IdeaMovieDetailsComponent implements OnInit {

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

  movieDetails: MovieAPIdetails
      = {

    Title: 'string',
    Year: 'string',
    Rated: 'string',
    Released: 'string',
    Runtime: 'string',

    Genre: 'string',
    Director: 'string',
    Writer: 'string',
    Actors: 'string',
    Plot: 'string',

    Language: 'string',
    Country: 'string',
    Awards: 'string',
    Poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png',
    Ratings: null,
    // Ratings: [{Source: string, Value: string}];

    Metascore: 'string',
    imdbRating: 'string',
    imdbVotes: 'string',
    imdbID: 'string',
    Type: 'string',

    DVD: 'string',
    BoxOffice: 'string',
    Production: 'string',
    Website: 'string',
    Response: 'string'
  };

  // for notifications:

  style = 'material';
  title = 'Success!';
  body = 'Movie is saved!';
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

  friendsSub: Subscription
  friendsWatchedThatMovie: UserModel[] = [{
    id: 1,
    name: "user",
    surname: "user",
    picture: "https://forum.mikrotik.com/styles/canvas/theme/images/no_avatar.jpg"
  }]

  friendData: FriendDataModel[] = []

  commentRate: CommentRateModel[]

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any, // saljemo id filma i za njega uzimamo podatke
      public dialogRef: MatDialogRef<IdeaMovieDetailsComponent>,
      private alertController: AlertController,
      private savedMoviesService: SavedMoviesService,
      private snotifyService: SnotifyService,
      private matDialog: MatDialog,
      private friendsService: FriendshipService
  ) { }


  ngOnInit() {

    console.log(this.data)
    try {
      fetch('http://www.omdbapi.com/?i=' + this.data.dataKey + '&apikey=4a249f8d')
          .then(response => response.json())
          .then(movie => {
            this.movieDetails = movie;
            console.log(this.movieDetails)

            this.friendsSub = this.friendsService.getFriendsWatchedThatMovie(movie.imdbID).subscribe((friends)=> {
              console.log(friends)
              this.friendsWatchedThatMovie = friends

              for(let i = 0; i< friends.length; i++){
                this.friendsService.getFriendCommentRate(friends[i].id, movie.imdbID).subscribe((commRate)=> {
                  var friendData = new FriendDataModel(
                      friends[i].id,
                      friends[i].name,
                      friends[i].surname,
                      friends[i].picture,
                      commRate.comment,
                      commRate.rate
                  )
                  this.friendData.push(friendData)
                })
              }
            })
          });

    } catch (e) {
      console.log(e);
    }



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

  delete(){
    console.log(this.data.dataKey)

    this.savedMoviesService.delete(this.data.dataKey).subscribe( () => {
          //  uspesno = true;
          this.dialogRef.close();
          this.snotifyService.success(this.body, this.title, this.getConfig());

        },
        (error => {
          // uspesno = false;
          console.log(error)
          this.dialogRef.close();
          this.snotifyService.error("Error while deleting the movie. Movie is not deleted.", "Error", this.getConfigError());
        }));
  }

  addToWatchedMovies( ){

    console.log(this.movieDetails)
   //this.dialogRef.close();
    const dialogRef = this.matDialog.open(AddWatchedMovieComponent, {
      role: 'dialog',
      height: '450px',
      width: '500px',
      data: {
        dataKey: this.movieDetails,
      }
    });

  }

  addToSavedMovies (){

    let sacuvan

      this.savedMoviesService.addSavedMovie(this.movieDetails.imdbID, this.movieDetails.Title, this.movieDetails.Poster,
          Number(this.movieDetails.Year), this.movieDetails.Genre, this.movieDetails.Actors, this.movieDetails.Country,
          this.movieDetails.Director, Number(this.movieDetails.Runtime.substring(0, this.movieDetails.Runtime.length-4)) ).subscribe( () => {

            //  uspesno = true;
            this.dialogRef.close();
            this.snotifyService.success(this.body, this.title, this.getConfig());
          },
          (error => {
            // uspesno = false;
            console.log(error)
            this.dialogRef.close();
            if( error.error.erroe == "SavedMovie currently exists!") {
              this.snotifyService.error("This movie exists in your saved movies list!", "Error", this.getConfigError());
            } else {
              this.snotifyService.error("Error while saving the movie. Movie is not saved.", "Error", this.getConfigError());
            }
          }));

  }

  seeFriends(){

    const dialogRef = this.matDialog.open(FriendsWhachedMovieComponent, {
      role: 'dialog',
      height: '500px',
      width: '500px',
      data: {
        dataKey: this.friendData,
      }
    });

  }


}
