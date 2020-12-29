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
import {UserGet} from '../../auth/user-get.model';

class MovieStringDate {
    constructor(
        public id: string,
        public actors: string,
        public year: any,
        public name: string,
        public director: string,
        public duration: any,
        public genre: string,
        public country: string,
        public rate: any,
        public comment: string,
        public dateTimeWatched: string,
        public dateTimeAdded: string,
        public poster: string,
        public user: UserGet
        //  public userId: string
    ) {}
}

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

  //friendMovies = this.data.dataKey.friendMovies


    friendMovies: Movie [] = [{
        id: "string",
        actors: "string",
        year: 5,
        name: "string",
        director: "string",
        duration: 5,
        genre: "string",
        country: "string",
        rate: 5,
        comment: "string",
        dateTimeWatched: "string",
        dateTimeAdded:new Date(),
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png",
        user:new UserGet("name", "surname", "picture")
    }]

    friendsMoviesString: MovieStringDate [] =[{
        id: "string",
        actors: "string",
        year: 5,
        name: "string",
        director: "string",
        duration: 5,
        genre: "string",
        country: "string",
        rate: 5,
        comment: "string",
        dateTimeWatched: "string",
        dateTimeAdded:'20.12.2020 12:17',
        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png",
        user:new UserGet("name", "surname", "picture")
    }]

    friendName = this.data.dataKey.userName
    friendSurname = this.data.dataKey.userSurname
    friendId = this.data.dataKey.userId

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

      this.moviesService.getMoviesFriend(this.friendId).subscribe(movies => {
          console.log(movies)
          this.friendMovies = movies;

          var localMovies = new Array()

          for( var i = 0; i< movies.length; i++) {
              let movie = new MovieStringDate(
                  movies[i].id,
                  movies[i].actors,
                  movies[i].year,
                  movies[i].name,
                  movies[i].director,
                  movies[i].duration,
                  movies[i].genre,
                  movies[i].country,
                  movies[i].rate,
                  movies[i].comment,
                  movies[i].dateTimeWatched,
                  this.datePipe.transform(movies[i].dateTimeAdded, 'dd.MM.yyyy HH:mm'),
                  movies[i].poster,
                  movies[i].user
              );
              localMovies.push(movie)
          }
          this.friendsMoviesString = localMovies
          console.log(this.friendsMoviesString)

      }, (error => {
          console.log(error)
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

}
