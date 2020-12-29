import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthResponseData, AuthService, ResponseUserData} from '../../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {UserModel} from '../models/user.model';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {FriendRequestModel} from '../models/friend-request.model';
import {WatchedMovieAddModel} from '../models/watched-movie-add.model';
import {UserGet} from '../../auth/user-get.model';


interface UserData {
 id: any,
  email: string,
 name: string,
 surname: string,
 picture: string
}

interface FriendRequestModelRes {
 userSenderId: number,
 userSender: UserModel,
 userRecipientId: number,
 userRecipient: UserModel,
 friendshipDate: string,
 statusCodeID: string
}

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private _myFriends = new BehaviorSubject<UserModel[]>([]);
  private _filmLoUsers = new BehaviorSubject<UserModel[]>([]);
  private _mySentRequests = new BehaviorSubject<FriendRequestModel[]>([]);
  private _myRequests = new BehaviorSubject<FriendRequestModel[]>([]);

  friendData: UserModel
  filmLoUserData: UserModel


  constructor(private http: HttpClient, private authService: AuthService) { }

  get allMyFriends(){
    return this._myFriends.asObservable();
  }

  get allFilmLoUsers(){
      return this._filmLoUsers.asObservable();
  }

    get mySentRequests(){
        return this._mySentRequests.asObservable();
    }

    get myRequests(){
        return this._myRequests.asObservable();
    }

  getFriendInfo(friendId: number){

      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http
                  .get<FriendRequestModelRes>(
                      `https://localhost:44397/api/User/friendInfo/${friendId}`, {
                          headers: new HttpHeaders({
                              'Authorization': token
                          })
                      }
                  );
          }),
          map((friend) => {
              console.log(friend);
              var myFriend = new FriendRequestModel(
                  friend.userSenderId,
                  friend.userSender,
                  friend.userRecipientId,
                  friend.userRecipient,
                  friend.friendshipDate,
                  friend.statusCodeID
              )
              return myFriend;
          })
      );
  }

  sentFriendRequest(friendId: number){

      let newRequest: FriendRequestModel;
      let fetchedUserId: any;

      let JSONdata = {
          "UserRecipientId": friendId
      }
      return this.authService.userId.pipe(
          take(1),
          switchMap(userId => { // jer menjamo observable
              fetchedUserId = userId;
              return this.authService.token;
          }),
          take(1),
          switchMap((token) => {
              return this.http
                  .post<FriendRequestModelRes>(
                      `https://localhost:44397/api/User/addFriend`,
                      JSONdata,
                      {headers: new HttpHeaders({
                              'Content-Type': "application/json",
                              'Authorization': token
                          })}
                  );

          }),
          switchMap((resData) => {
              console.log(resData)
             var newRequestRes = new FriendRequestModel(
                  resData.userSenderId,
                  resData.userSender,
                  resData.userRecipientId,
                  resData.userRecipient,
                  resData.friendshipDate,
                  resData.statusCodeID
              )
              newRequest = newRequestRes
              return this.mySentRequests;
          }),
          take(1),
          tap((requests) => {

              this._mySentRequests.next(
                  requests.concat(newRequest)
              );
          })
      )
  }

  getFilmLoUsers () {
      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http
                  .get<{ [key: string]: UserData }>(
                      `https://localhost:44397/api/User/allUsers`, {headers: new HttpHeaders({
                              'Authorization': token
                          })}
                  );
          }),
          map((userData) => {
              console.log(userData);
              const users: UserModel[] = [];
              for (const key in userData) {
                  if (userData.hasOwnProperty(key)) {
                      users.push(
                          new UserModel(
                              userData[key].id,
                              userData[key].name,
                              userData[key].surname,
                              userData[key].picture
                          ));
                  }
              }
              const filmLoUsers: UserModel[] = [];
              for(let user of users) {
                  filmLoUsers.push(user)
              }
              console.log(filmLoUsers)
              return filmLoUsers;
          }),
          tap(filmLoUsers => {
              this._filmLoUsers.next(filmLoUsers);
          })
      );
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

  getSentRequests() {
      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http
                  .get<{ [ key : string ] : FriendRequestModelRes }>(
                      `https://localhost:44397/api/User/sentFriendRequests`, {
                          headers: new HttpHeaders({
                              'Authorization': token
                          })
                      }
                  );
          }),
          map((requests) => {
              console.log(requests);
              const myRequests : FriendRequestModel[] = [];
              for (const key in requests) {
                  if(requests.hasOwnProperty(key)) {
                      myRequests.push(
                          new FriendRequestModel(
                              requests[ key ].userSenderId,
                              requests[ key ].userSender,
                              requests[ key ].userRecipientId,
                              requests[ key ].userRecipient,
                              requests[ key ].friendshipDate,
                              requests[ key ].statusCodeID
                          ));
                  }
              }
              const myFriendRequests : FriendRequestModel[] = [];
              for (let friendRequest of myRequests) {
                  myFriendRequests.push(friendRequest);
              }
              console.log(myFriendRequests);
              return myFriendRequests;
          }),
          tap(myFriendRequests => {
              this._mySentRequests.next(myFriendRequests);
          })
      );

  }

  getMyRequests () {
      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http
                  .get<{ [ key : string ] : FriendRequestModelRes }>(
                      `https://localhost:44397/api/User/friendRequests`, {
                          headers: new HttpHeaders({
                              'Authorization': token
                          })
                      }
                  );
          }),
          map((requests) => {
              console.log(requests);
              const myRequests : FriendRequestModel[] = [];
              for (const key in requests) {
                  if(requests.hasOwnProperty(key)) {
                      myRequests.push(
                          new FriendRequestModel(
                              requests[ key ].userSenderId,
                              requests[ key ].userSender,
                              requests[ key ].userRecipientId,
                              requests[ key ].userRecipient,
                              requests[ key ].friendshipDate,
                              requests[ key ].statusCodeID
                          ));
                  }
              }
              const myFriendRequests : FriendRequestModel[] = [];
              for (let friendRequest of myRequests) {
                  myFriendRequests.push(friendRequest);
              }
              console.log(myFriendRequests);
              return myFriendRequests;
          }),
          tap(myFriendRequests => {
              this._myRequests.next(myFriendRequests);
          })
      );
  }

  deleteFriend( friendId: number) {

      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http.put<"">(`https://localhost:44397/api/User/deleteFriend/${friendId}`, "",
                  {headers: new HttpHeaders({
                      'Authorization': token
                  })});
          }),
          switchMap(() => {
              return this.allMyFriends;
          }),
          take(1),
          tap( (allMyfriends) => {
              this._myFriends.next(allMyfriends.filter((friend) => friend.id !== friendId));
          })
      );
  }

  acceptRequest(friendId: number){

      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http.post<FriendRequestModelRes>(`https://localhost:44397/api/User/acceptRequest/${friendId}`, "",
                  {headers: new HttpHeaders({
                          'Authorization': token
                      })});
          }),
          switchMap(() => {
              return this.myRequests;
          }),
          take(1),
          tap( (requests) => {
              this._myRequests.next(requests.filter((request) => request.userSenderId !== friendId));
          })
      );
  }

  declineRequest(friendId: number){

      return this.authService.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http.post<FriendRequestModelRes>(`https://localhost:44397/api/User/declineRequest/${friendId}`, "",
                  {headers: new HttpHeaders({
                          'Authorization': token
                      })});
          }),
          switchMap(() => {
              return this.myRequests;
          }),
          take(1),
          tap( (requests) => {
              this._myRequests.next(requests.filter((request) => request.userSenderId !== friendId));
          })
      );

  }

}
