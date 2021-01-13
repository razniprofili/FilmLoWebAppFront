import {Component, Inject, OnInit} from '@angular/core';
import {MovieAPIdetails} from '../../home/models/movieAPIdetails.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AlertController} from '@ionic/angular';
import {SavedMoviesService} from '../../home/services/saved-movies.service';
import {Movie} from '../../home/models/movie.model';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {UserGet} from '../../auth/user-get.model';
import {AddWatchedMovieComponent} from '../add-watched-movie/add-watched-movie.component';
import {UpdateMovieComponent} from '../update-movie/update-movie.component';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-watched-movie-details',
  templateUrl: './watched-movie-details.component.html',
  styleUrls: ['./watched-movie-details.component.scss'],
})
export class WatchedMovieDetailsComponent implements OnInit {

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

  movie: Movie = {
    id: "string",
    actors: "string",
    year: 123,
    name: "string",
    director: "string",
    duration: 123,
    genre: "string",
    country: "string",
    rate: 5,
    comment: "string",
    dateTimeWatched: "string",
    dateTimeAdded: new Date(),
    poster: "https://www.ikea.com/my/en/images/products/ekbacken-worktop-double-sided-with-white-edge-light-grey-white-laminate__0866572_PE516397_S5.JPG",
    user:  {
      name: "User",
      surname: "User",
      picture: "https://forum.mikrotik.com/styles/canvas/theme/images/no_avatar.jpg"
    }
  }

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

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any, // saljemo id filma i za njega uzimamo podatke
      public dialogRef: MatDialogRef<WatchedMovieDetailsComponent>,
      private alertController: AlertController,
      private watchedMoviesService: WatchedMoviesService,
      private snotifyService: SnotifyService,
      private matDialog: MatDialog
  ) { }



  ngOnInit() {

    // pri otvaranju pozivamo API i uzimamo detalje filma

    this.watchedMoviesService.getWatchedMovie(this.data.dataKey).subscribe( movie => {
      this.movie = movie;
      console.log(this.movie)
    },
        (error => {
          console.log(error)
          this.dialogRef.close();
          this.snotifyService.error("Error while loading movie data.", "Error", this.getConfigError());
        }));

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

    this.watchedMoviesService.delete(this.data.dataKey).subscribe( () => {
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

  editMovie(){

    var days = this.movie.dateTimeWatched.substr(0,3)
    var month = this.movie.dateTimeWatched.substr(3,3)
    var year = this.movie.dateTimeWatched.substr(6,5)
    var newDate = month+days+year
    console.log(newDate)

   // this.dialogRef.close();
    const dialogRef = this.matDialog.open(UpdateMovieComponent, {
      role: 'dialog',
      height: '430px',
      width: '500px',
      data: {
        dataKey: this.data.dataKey // its movie id
      }
    });
    let instance= dialogRef.componentInstance;
    instance.currentRate = this.movie.rate;
    instance.myComment = this.movie.comment;
    instance.textValue = new Date(newDate)
  }

}
