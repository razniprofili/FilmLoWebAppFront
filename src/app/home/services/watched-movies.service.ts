import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Movie} from '../models/movie.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {UserGet} from '../../auth/user-get.model';

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
  poster: string,
  user: UserGet
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
                      "IZMENITI KASNIJE!!!",
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
                      "IZMENITI KASNIJE!!!",
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
}
