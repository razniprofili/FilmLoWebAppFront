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

@NgModule({
  imports: [MatIconModule, MatButtonModule]
})

@Component({
  selector: 'app-idea-movie-details',
  templateUrl: './idea-movie-details.component.html',
  styleUrls: ['./idea-movie-details.component.scss'],
})
export class IdeaMovieDetailsComponent implements OnInit {

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
    Poster: 'string',
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

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any, // saljemo id filma i za njega uzimamo podatke
      public dialogRef: MatDialogRef<IdeaMovieDetailsComponent>,
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

  addToWatchedMovies( ){

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
            this.snotifyService.error("Error while saving the movie. Movie is not saved.", "Error", this.getConfigError());
          }));

  }

}
