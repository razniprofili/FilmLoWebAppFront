import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {UserModel} from '../models/user.model';
import {map, switchMap, take, tap} from 'rxjs/operators';

interface UserData {
 id: any,
  email: string,
 name: string,
 surname: string,
 picture: string
}

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private _myFriends = new BehaviorSubject<UserModel[]>([]);
  friendData: UserModel


  constructor(private http: HttpClient, private authService: AuthService) { }

  get allMyFriends(){
    return this._myFriends.asObservable();
  }

  getMyFriends(){

    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .get<{ [key: string]: UserData }>(
                  `https://localhost:44397/api/User/myfriends`, {headers: new HttpHeaders({
                      'Authorization': token
                    })}
              );
        }),
        map((userData) => {
          console.log(userData);
          const friends: UserModel[] = [];
          for (const key in userData) {
            if (userData.hasOwnProperty(key)) {
              friends.push(
                  new UserModel(
                      userData[key].id,
                      userData[key].name,
                      userData[key].surname,
                      userData[key].picture
                  ));
            }
          }
          const myFriends: UserModel[] = [];
          for(let friend of friends) {
            myFriends.push(friend)
          }
          console.log(myFriends)
          return myFriends;
        }),
        tap(myFriends => {
          this._myFriends.next(myFriends);
        })
    );

  }

}
