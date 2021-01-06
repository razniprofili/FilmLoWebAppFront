import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {StatisticModel} from '../models/statistic.model';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {PopularMovieModel} from '../models/popular-movie.model';
import {YearStatisticModel} from '../models/year-statistic.model';


@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private _statistic = new BehaviorSubject<StatisticModel>(null);
  private _popularMovies = new BehaviorSubject<PopularMovieModel[]>([]);
  private _yearStatistic = new BehaviorSubject<YearStatisticModel[]>([]);

  constructor(private http: HttpClient,
              private authService: AuthService)
  { }


  get statistic(){
    return this._statistic.asObservable();
  }

  get popularMovies(){
    return this._popularMovies.asObservable();
  }

  get yearStatistic(){
        return this._yearStatistic.asObservable();
    }

  getStatistic(){

    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .get<StatisticModel>(
                  `https://localhost:44397/api/WatchedMovies/watchedMoviesStats`, {
                    headers: new HttpHeaders({
                      'Authorization': token
                    })
                  }
              );
        }),
        map((stat) => {
          console.log(stat);
          var statistic = new StatisticModel(
              stat.userId,
              stat.totalCount,
              stat.totalTime,
              stat.averageRate
          )
          return statistic;
        }),
        tap(statistic => {
          this._statistic.next(statistic);
        })
    );
  }

  getPopularMovies () {
    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .get<{ [key: string]: PopularMovieModel }>(
                  `https://localhost:44397/api/WatchedMovies/popularMovies`, {
                    'headers': new HttpHeaders({
                      'Authorization': token
                    })}
              );
        }),
        map((movieData) => {
          console.log(movieData);
          const popularMovies: PopularMovieModel[] = [];
          for (const key in movieData) {
            if (movieData.hasOwnProperty(key)) {
              popularMovies.push(
                  new PopularMovieModel(
                      movieData[key].userId,
                      movieData[key].movieId,
                      movieData[key].movieName,
                  ));
            }
          }
          const popMovies: PopularMovieModel[] = [];
          for(let movie of popularMovies) {
            popMovies.push(movie)
          }
          console.log(popMovies)
          return popMovies;
        }),
        tap(popMovies => {
          this._popularMovies.next(popMovies);
        })
    );
  }

  getYearStatistic () {
        return this.authService.token.pipe(
            take(1),
            switchMap((token) => {
                return this.http
                    .get<{ [key: string]: YearStatisticModel }>(
                        `https://localhost:44397/api/WatchedMovies/yearStatistic`, {
                            'headers': new HttpHeaders({
                                'Authorization': token
                            })}
                    );
            }),
            map((data) => {
                console.log(data);
                const yearStatistic: YearStatisticModel[] = [];
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        yearStatistic.push(
                            new YearStatisticModel(
                                data[key].userId,
                                data[key].year,
                                data[key].count,
                            ));
                    }
                }
                const yearStat: YearStatisticModel[] = [];
                for(let yearData of yearStatistic) {
                    yearStat.push(yearData)
                }
                console.log(yearStat)
                return yearStat;
            }),
            tap(yearStat => {
                this._yearStatistic.next(yearStat);
            })
        );
    }

}
