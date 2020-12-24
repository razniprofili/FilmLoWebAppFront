import { Injectable } from '@angular/core';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {User} from "./user.model";
import { Observable, throwError } from 'rxjs';
import {UserGet} from './user-get.model';
//import {log} from "util";


export interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  id: number;
  mail: string;
  name: string;
  surname: string;
  token: string;
  expirationTime: string;
}

export interface Links {
    href: string
    rel: string
    method: string
}

export interface JsonResponse {
    AuthResponseData: AuthResponseData
    links: Links[]
}

export interface ResponseUserData {
    id: number;
    email: string;
    name: string;
    surname: string;
    picture: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private ulogovan = false;

  private _user = new BehaviorSubject<User>(null);
  private _userGet = new BehaviorSubject<UserGet>(null);

  tokenUser: string;
  userLocalID: number;
  //gde god se pretplatimo na User-a imacemo na uvid svaku promenu!
  //dobijamo najnoviju prethodno emitovanu vrednost

  constructor(private http: HttpClient) { }

  header = {
    headers: new HttpHeaders().set('Authorization', `Basic ${this.tokenUser}`)
  }

  get isUserAuth() {
    return this._user.asObservable().pipe(
        //posto menjamo vrednost koja se vraca koristimo map
        map((user) => {
          if (user) {
            return !!user.token; //truthy samo ako nije prazan! proveravamo to i istovremeno ga vracamo
          } else {
            return false;
          }
        })
    );
  }

  get currentUser (){
      return this._user.asObservable().pipe(
          map((user) => {
              console.log("uslo cur user")
              console.log(user)
              if (user) {
                  return user;
              } else {
                  return null;
              }
          })
      );
  }

  get currentUserInfo (){
        return this._userGet.asObservable().pipe(
            map((user) => {
                console.log("uslo cur user")
                console.log(user)
                if (user) {
                    return user;
                } else {
                    return null;
                }
            })
        );
    }

  get userId() {
    return this._user.asObservable().pipe(
        map((user) => {
          if (user) {
            return user.id;
          } else {
            return null;
          }
        })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
        map((user) => {
          if (user) {
            return user.token;
          } else {
            return null;
          }
        })
    );
  }

  getUser(userId: number) {

      return this.token.pipe(
    take(1),
    switchMap ((token)=> {
        console.log(token)
        return this.http.get<ResponseUserData>(`https://localhost:44397/api/User/?id=${userId}`, {headers: new HttpHeaders({
                'Authorization': token
            })});
    } ), map((userData) => {
        console.log(userData)
        const user: UserGet= new UserGet(userData.name, userData.surname, userData.picture)
        console.log(user)
        return user;
    }), tap(userGet => {
        this._userGet.next(userGet);
    }));
  }

  login(user: UserData) {
    this.ulogovan = true;

    return this.http.post<JsonResponse>(`https://localhost:44397/api/User/Login`,
        {
          email: user.email,
          password: user.password
        }).pipe(tap(userData => {
        console.log(userData.AuthResponseData)
        const expirationDate = new Date(userData.AuthResponseData.expirationTime);
        const newUser = new User(userData.AuthResponseData.id, userData.AuthResponseData.mail, userData.AuthResponseData.token, expirationDate);
      this.tokenUser = userData.AuthResponseData.token;
      this.userLocalID = userData.AuthResponseData.id;
      this._user.next(newUser); // postavljamo ovog usera, i dalje mozemo da ga koristimo
    }));
  }

  logout() {
    // this.ulogovan = false;
    this._user.next(null);
  }

  deleteAccount(){

    console.log("usao delete")
    console.log(this.tokenUser)

      // brisemo current usera
     // this._user.next(null);
      return this.token.pipe(
          take(1),
          switchMap((token) => {
              return this.http.put<AuthResponseData>(`https://localhost:44397/api/User/delete`, "" ,{headers: new HttpHeaders({
                      'Authorization': token
                  })});
          }));
  }

  register(user: UserData) {
    this.ulogovan = true;
    return this.http.post<JsonResponse>(`https://localhost:44397/api/User/register`, {
      email: user.email,
      password: user.password,
      name: user.name,
      surname: user.surname
    }).pipe( tap(userData => {
           console.log(userData.AuthResponseData)
          const expirationDate = new Date(userData.AuthResponseData.expirationTime);
          const newUser = new User(userData.AuthResponseData.id, userData.AuthResponseData.mail, userData.AuthResponseData.token, expirationDate);
          this.tokenUser = userData.AuthResponseData.token;
          this.userLocalID = userData.AuthResponseData.id;
          this._user.next(newUser);
        }));
  }

  updateUser( name: string, picture: string, surname: string) {

        return this.token.pipe(
            take(1),
            switchMap((token) => {
                return this.http
                    .put(`https://localhost:44397/api/User`, {
                        name,
                        surname,
                        picture
                    }, {headers: new HttpHeaders({
                            'Content-Type': "application/json",
                            'Authorization': token
                        })});
            }),
            switchMap(() => this.currentUserInfo),
            take(1),
            tap((user) => {
                user.name = name;
                user.surname = surname;
                user.picture = picture;
                this._userGet.next(user);
            })
        );
    }

  private handleError(errorResponse: HttpErrorResponse){
    if(errorResponse.error instanceof ErrorEvent){
      console.error('Client Side Error: ', errorResponse.error.message);
    } else {
      console.error('Server Side Error: ', errorResponse);
    }

    return throwError('desila se greska pokusajte kasnije');
  }
}
