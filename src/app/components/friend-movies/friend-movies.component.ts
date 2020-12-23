import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Movie} from '../../home/models/movie.model';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {formatDate} from '@angular/common';
import { DatePipe } from '@angular/common';
import {AddWatchedMovieComponent} from '../add-watched-movie/add-watched-movie.component';
import {SavedMoviesService} from '../../home/services/saved-movies.service';

@Component({
  selector: 'app-friend-movies',
  templateUrl: './friend-movies.component.html',
  styleUrls: ['./friend-movies.component.scss'],
  animations: [
      trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
    providers: [DatePipe]
})
export class FriendMoviesComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<FriendMoviesComponent>,
      private moviesService: WatchedMoviesService,
      private snotifyService:SnotifyService,
      private datePipe: DatePipe,
      private matDialog: MatDialog,
      private savedMoviesService: SavedMoviesService
  ) { }

  friendMovies = this.data.dataKey
   // friendMovies: Movie[] = new Array();

  columnsToDisplay = ['name', 'rate', 'comment', 'dateTimeAdded'];
  expandedElement: Movie | null

    style = 'material';
    title = 'Done!';
    body = 'Movie added to saved movie list!';
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

  ngOnInit() {
      console.log( this.datePipe.transform(new Date("2020-12-24 18:19"), 'dd-MM-yyyy HH:mm', 'CET' ))
     // this.changeDate()
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

    addMovie(movieId: string, genre: string, director: string, actors: string, year: any, duration: string, country: string, poster: string, title: string){

     const movieDetails = {
          'imdbID': movieId,
          'Poster' : poster,
          'Country': country,
          'Genre': genre,
          "Runtime": duration + " min",
          "Director": director,
          "Title": title,
          "Actors": actors,
          "Year": year
      }

        const dialogRef = this.matDialog.open(AddWatchedMovieComponent, {
            role: 'dialog',
            height: '430px',
            width: '500px',
            data: {
                dataKey: movieDetails,
            }
        });
    }

    saveMovie(movieId: string, genre: string, director: string, actors: string, year: any, duration: string, country: string, poster: string, title: string) {

        this.savedMoviesService.addSavedMovie(movieId, title, poster,
            Number(year), genre, actors, country, director, Number(duration)).subscribe( () => {

                //  uspesno = true;
                this.snotifyService.success(this.body, this.title, this.getConfig());
            },
            (error => {
                // uspesno = false;
                console.log(error)
                if(error.error.erroe == 'SavedMovie currently exists!') {
                    this.snotifyService.error("Movie currently exists in saved list. Movie is not saved.", "Error", this.getConfigError());
                } else {
                    this.snotifyService.error("Error while saving the movie. Movie is not saved.", "Error", this.getConfigError());
                }

            }));
    }

    exit(){
      this.dialogRef.close();
    }

    // changeDate() {
    //   for(let i = 0; i< this.friendMoviesGet.length; i++) {
    //       this.datePipe.transform(this.friendMoviesGet[i].dateTimeAdded, 'dd-MM-yyyy HH:mm', 'CET' )
    //       this.friendMovies.concat(this.friendMoviesGet[i])
    //   }
    // }
}
