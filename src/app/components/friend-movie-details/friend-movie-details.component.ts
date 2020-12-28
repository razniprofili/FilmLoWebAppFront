import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Movie} from '../../home/models/movie.model';
import {DatePipe} from '@angular/common';
import {SavedMoviesService} from '../../home/services/saved-movies.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {AlertController} from '@ionic/angular';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {AddWatchedMovieComponent} from '../add-watched-movie/add-watched-movie.component';
import {MovieAPIdetails} from '../../home/models/movieAPIdetails.model';

@Component({
  providers: [DatePipe],
  selector: 'app-friend-movie-details',
  templateUrl: './friend-movie-details.component.html',
  styleUrls: ['./friend-movie-details.component.scss'],
})
export class FriendMovieDetailsComponent implements OnInit {

  // for notifications:

  style = 'material';
  title = 'Success!';
  body = 'Movie added from the list!';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public datepipe: DatePipe,
              public savedMoviesService: SavedMoviesService,
              public watchedMoviesService: WatchedMoviesService,
              public dialogRef: MatDialogRef<FriendMovieDetailsComponent>,
              private alertController: AlertController,
              private snotifyService: SnotifyService,
              private matDialog: MatDialog) { }

  movie: Movie = this.data.dataKey

  dateMovie = this.datepipe.transform(this.movie.dateTimeAdded, 'dd.MM.yyyy HH:mm');

  ngOnInit() {}

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

  movieDetails: MovieAPIdetails
      = {

    Title: this.movie.name,
    Year: this.movie.year,
    Rated: 'string',
    Released: 'string',
    Runtime: this.movie.duration + " min",

    Genre: this.movie.genre,
    Director: this.movie.director,
    Writer: 'string',
    Actors: this.movie.actors,
    Plot: 'string',

    Language: 'string',
    Country: this.movie.country,
    Awards: 'string',
    Poster: this.movie.poster,
    Ratings: null,
    // Ratings: [{Source: string, Value: string}];

    Metascore: 'string',
    imdbRating: 'string',
    imdbVotes: 'string',
    imdbID: this.movie.id,
    Type: 'string',

    DVD: 'string',
    BoxOffice: 'string',
    Production: 'string',
    Website: 'string',
    Response: 'string'
  };

  addToWatchedMovies(){

    console.log(this.movieDetails)
    this.dialogRef.close();
    const dialogRef = this.matDialog.open(AddWatchedMovieComponent, {
      role: 'dialog',
      height: '430px',
      width: '500px',
      data: {
        dataKey: this.movieDetails,

      }
    });
  }



  addToSavedMovies(){




    this.savedMoviesService.addSavedMovie(this.movie.id, this.movie.name, this.movie.poster,
        Number(this.movie.year), this.movie.genre, this.movie.actors, this.movie.country,
        this.movie.director, this.movie.duration ).subscribe( () => {

          //  uspesno = true;
          this.dialogRef.close();
          this.snotifyService.success(this.body, this.title, this.getConfig());
        },
        (error => {
          // uspesno = false;
          console.log(error)
          this.dialogRef.close();
          this.snotifyService.error("Error while saving the movie. Movie is not saved.", "Error", this.getConfigError());
        }));
  }
}
