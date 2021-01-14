import {Component, Inject, OnInit} from '@angular/core';
import {Movie} from '../../home/models/movie.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AlertController} from '@ionic/angular';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {UpdateMovieComponent} from '../update-movie/update-movie.component';

@Component({
  selector: 'app-popular-movie-details',
  templateUrl: './popular-movie-details.component.html',
  styleUrls: ['./popular-movie-details.component.scss'],
})
export class PopularMovieDetailsComponent implements OnInit {

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

  constructor(      @Inject(MAT_DIALOG_DATA) public data: any, // saljemo id filma i za njega uzimamo podatke
                    public dialogRef: MatDialogRef<PopularMovieDetailsComponent>,
                    private alertController: AlertController,
                    private watchedMoviesService: WatchedMoviesService,
                    private snotifyService: SnotifyService,
                    private matDialog: MatDialog) { }

  ngOnInit() {

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
          this.dialogRef.close();
          this.snotifyService.success(this.body, this.title, this.getConfig());

        },
        (error => {
          console.log(error)
          this.dialogRef.close();
          this.snotifyService.error("Error while deleting the movie. Movie is not deleted.", "Error", this.getConfigError());
        }));
  }

}
