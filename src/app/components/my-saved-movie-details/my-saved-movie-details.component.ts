import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MovieAPIdetails} from '../../home/models/movieAPIdetails.model';
import {AlertController} from '@ionic/angular';
import {SavedMoviesService} from '../../home/services/saved-movies.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {AddWatchedMovieComponent} from '../add-watched-movie/add-watched-movie.component';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-my-saved-movie-details',
  templateUrl: './my-saved-movie-details.component.html',
  styleUrls: ['./my-saved-movie-details.component.scss'],
})
export class MySavedMovieDetailsComponent implements OnInit {

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
      public dialogRef: MatDialogRef<MySavedMovieDetailsComponent>,
      private alertController: AlertController,
      private savedMoviesService: SavedMoviesService,
      private snotifyService: SnotifyService,
      private matDialog: MatDialog
  ) { }


  ngOnInit() {

    // pri otvaranju pozivamo API i uzimamo detalje filma
console.log(this.data)
    try {
      fetch('http://www.omdbapi.com/?i=' + this.data.dataKey + '&apikey=4a249f8d')
          .then(response => response.json())
          .then(movie => {
            this.movieDetails = movie;
            console.log(this.movieDetails)
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

}
