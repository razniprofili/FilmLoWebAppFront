import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Movie} from '../models/movie.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {UserGet} from '../../auth/user-get.model';
import {SavedMovieAddModel} from '../models/saved-movie-add.model';
import {SavedMovieModel} from '../models/saved-movie.model';
import {WatchedMovieAddModel} from '../models/watched-movie-add.model';

interface MovieData {
  id: string,
  actors: string,
  year: any,
  name: string,
  director: string,
  duration: any,
  genre: string,
  country: string,
  rate: any,
  comment: string,
  dateTimeWatched: string,
  dateTimeAdded: Date,
  poster: string,
  user: UserGet,
  links: Link[]
}

interface MovieDataUC {
    Id: string,
    Actors: string,
    Year: any,
    Name: string,
    Director: string,
    Duration: any,
    Genre: string,
    Country: string,
    Rate: any,
    Comment: string,
    DateTimeWatched: string,
    DateTimeAdded: Date,
    Poster: string,
    User: UserGet,
    links: Link[]
}

interface AddMovieData {
    Id: string,
    Name: string,
    Genre: string,
    Duration: any,
    Actors: string,
    Country: string,
    Director: string,
    Year: any,
    Rate: any,
    Comment: string,
    dateTimeWatched: string,
    Poster: string
}

interface Link {
    "href": string,
    "rel": string,
    "method": string
}

@Injectable({
  providedIn: 'root'
})
export class WatchedMoviesService {

  private _allFiendsMovies = new BehaviorSubject<Movie[]>([]);
  private _myWatchedMovies = new BehaviorSubject<Movie[]>([]);

  movieData: Movie;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // geters

  get allFiendsMovies(){
    return this._allFiendsMovies.asObservable();
  }

  get myWatchedMovies(){
    return this._myWatchedMovies.asObservable();
  }

// methods

  getMoviesForAllFriends(){

    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .get<{ [key: string]: MovieData }>(
                  `https://localhost:44397/api/WatchedMovies/allFriendsMovies`, {headers: new HttpHeaders({
                      'Authorization': token
                    })}
              );
        }),
        map((movieData) => {
          console.log(movieData);
          const movies: Movie[] = [];
          for (const key in movieData) {
            if (movieData.hasOwnProperty(key)) {
              movies.push(
                  new Movie(
                      movieData[key].id,
                      movieData[key].actors,
                      movieData[key].year,
                      movieData[key].name,
                      movieData[key].director,
                      movieData[key].duration,
                      movieData[key].genre,
                      movieData[key].country,
                      movieData[key].rate,
                      movieData[key].comment,
                      movieData[key].dateTimeWatched,
                      movieData[key].dateTimeAdded,
                      movieData[key].poster,
                      movieData[key].user
                  ));
            }
          }
          const firendsMovies: Movie[] = [];
          for(let movie of movies) {
            firendsMovies.push(movie)
          }
          console.log(firendsMovies)
          return firendsMovies;
        }),
        tap(firendsMovies => {
          this._allFiendsMovies.next(firendsMovies);
        })
    );

  }

  getMyWatchedMovies(){

    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .get<{ [key: string]: MovieData }>(
                  `https://localhost:44397/api/WatchedMovies/allMovies`, {headers: new HttpHeaders({
                      'Authorization': token
                    })}
              );
        }),
        map((movieData) => {
          console.log(movieData);
          const movies: Movie[] = [];
          for (const key in movieData) {
            if (movieData.hasOwnProperty(key)) {
              movies.push(
                  new Movie(
                      movieData[key].id,
                      movieData[key].actors,
                      movieData[key].year,
                      movieData[key].name,
                      movieData[key].director,
                      movieData[key].duration,
                      movieData[key].genre,
                      movieData[key].country,
                      movieData[key].rate,
                      movieData[key].comment,
                      movieData[key].dateTimeWatched,
                      movieData[key].dateTimeAdded,
                      movieData[key].poster,
                      movieData[key].user
                  ));
            }
          }
          const myMovies: Movie[] = [];
          for(let movie of movies) {
            myMovies.push(movie)
          }
          console.log(myMovies)
          return myMovies;
        }),
        tap(myMovies => {
          this._myWatchedMovies.next(myMovies);
        })
    );

  }

  getWatchedMovie(movieId: string){

      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http
                  .get<MovieDataUC>(`https://localhost:44397/api/WatchedMovies/getMovie/`+ movieId, {headers: new HttpHeaders({
                          'Authorization': token
                      })});
          }),
          map((resData) => {
              console.log(resData);
              return new Movie(
                  movieId,
                  resData.Actors,
                  resData.Year,
                  resData.Name,
                  resData.Director,
                  resData.Duration,
                  resData.Genre,
                  resData.Country,
                  resData.Rate,
                  resData.Comment,
                  resData.DateTimeWatched,
                  new Date(resData.DateTimeAdded),
                  resData.Poster,
                  resData.User
              );
          })
      );
  }

  delete(movieId: string){
        return this.authService.token.pipe(
            take(1),
            switchMap((token) => {
                return this.http
                    .put(`https://localhost:44397/api/WatchedMovies/delete/`+ movieId, "",{headers: new HttpHeaders({
                            'Authorization': token
                        })});
            }),
            switchMap(() => {
                return this.myWatchedMovies;
            }),
            take(1),
            tap((movies) => {
                this._myWatchedMovies.next(movies.filter((film) => film.id !== movieId));
            })
        );
    }

  addWatchedMovie ( movie: Movie) {
      let dateTimeAdded;
      let movieToAdd: WatchedMovieAddModel;
      let fetchedUserId: any;

        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => { // jer menjamo observable
                fetchedUserId = userId;
                return this.authService.token;
            }),
            take(1),
            switchMap((token) => {
                movieToAdd = new WatchedMovieAddModel(
                    movie.id,
                    movie.name,
                    movie.genre,
                    movie.duration,
                    movie.actors,
                    movie.country,
                    movie.director,
                    movie.year,
                    movie.rate,
                    movie.comment,
                    movie.dateTimeWatched,
                    movie.poster
                );
                console.log(movieToAdd)
                return this.http
                    .post<{ res: MovieDataUC }>(
                        `https://localhost:44397/api/WatchedMovies/addWatchedMovie`,
                        movieToAdd,
                        {headers: new HttpHeaders({
                                'Content-Type': "application/json",
                                'Authorization': token
                            })}
                    );
            }),
            switchMap((resData) => {
                dateTimeAdded = new Date()
                return this.myWatchedMovies;
            }),
            take(1),
            tap((movies) => {
                movie.dateTimeAdded = dateTimeAdded

                this._myWatchedMovies.next(
                    movies.concat(movie)
                );
            })
        )
    }

}
