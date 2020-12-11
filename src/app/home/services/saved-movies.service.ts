import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Movie} from '../models/movie.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {UserGet} from '../../auth/user-get.model';
import {SavedMovieModel} from '../models/saved-movie.model';
import {SavedMovieAddModel} from '../models/saved-movie-add.model';

interface MovieData {
  id: string,
  name: string,
  poster: string,
  userId: any
}

export interface Links {
    href: string
    rel: string
    method: string
}

export interface addedMovie {
    id : string,
    name : string,
    poster : string,
    userId : any,
    actors : string,
    year : any,
    director : string,
    duration : any,
    genre : string,
    country : string,
    links : Links[]
}



export interface JsonResponse {
    addedMovie: addedMovie

}


@Injectable({
  providedIn: 'root'
})
export class SavedMoviesService {

  private _savedMovies = new BehaviorSubject<SavedMovieModel[]>([]);
 // movieData: Movie;

  constructor(private http: HttpClient, private authService: AuthService) { }

  get allSavedMovies(){
    return this._savedMovies.asObservable();
  }

    addSavedMovie ( idMovie: string, name: string, poster: string, year: any, genre: string, actors: string,
              country: string, director: string, duration: any) {
        let noviId;
        let noviFilm: SavedMovieAddModel;
        let fetchedUserId: any;

        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => { // jer menjamo observable
                fetchedUserId = userId;
                return this.authService.token;
            }),
            take(1),
            switchMap((token) => {
                noviFilm = new SavedMovieAddModel(
                    idMovie,
                    name,
                    poster,
                    year,
                    genre,
                    actors,
                    country,
                    director,
                    duration,
                    fetchedUserId
                );
console.log(noviFilm)
                return this.http
                    .post<{ JsonResponse }>(
                        `https://localhost:44397/api/SavedMovies/add`,
                        noviFilm,
                        {headers: new HttpHeaders({
                                'Content-Type': "application/json",
                                'Authorization': token
                            })}
                    );
            }),
            switchMap((resData) => {
                return this.allSavedMovies;
            }),
            take(1),
            tap((movies) => {
                this._savedMovies.next(
                    movies.concat(noviFilm)
                );
            })
        )
    }

  getSavedMovies(){

    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .get<{ [key: string]: MovieData }>(
                  `https://localhost:44397/api/SavedMovies`, {headers: new HttpHeaders({
                      'Authorization': token
                    })}
              );
        }),
        map((movieData) => {
          console.log(movieData);
          const movies: SavedMovieModel[] = [];
          for (const key in movieData) {
            if (movieData.hasOwnProperty(key)) {
              movies.push(
                  new SavedMovieModel(
                      movieData[key].id,
                      movieData[key].name,
                      movieData[key].poster,
                      movieData[key].userId,
                  ));
            }
          }
          const savedMovies: SavedMovieModel[] = [];
          for(let movie of movies) {
            savedMovies.push(movie)
          }
          console.log(savedMovies)
          return savedMovies;
        }),
        tap(firendsMovies => {
          this._savedMovies.next(firendsMovies);
        })
    );

  }

  delete(movieId: string){
      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http
                  .put(`https://localhost:44397/api/SavedMovies/delete/`+ movieId, "",{headers: new HttpHeaders({
                          'Authorization': token
                      })});
          }),
          switchMap(() => {
              return this.allSavedMovies;
          }),
          take(1),
          tap((movies) => {
              this._savedMovies.next(movies.filter((film) => film.id !== movieId));
          })
      );
  }
}
