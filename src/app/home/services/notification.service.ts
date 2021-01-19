import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NotificationModel} from '../models/notification.model';
import {map , switchMap , take , tap} from 'rxjs/operators';
import {HttpClient , HttpHeaders} from '@angular/common/http';
import {FriendRequestModel} from '../models/friend-request.model';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _myNotifications = new BehaviorSubject<NotificationModel[]>([]);

  constructor( private authService: AuthService, private http: HttpClient) { }

  get myNotifications(){
    return this._myNotifications.asObservable();
  }

  getMyNotifications () {
    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .get<{ [ key : string ] : NotificationModel }>(
                  `https://localhost:44397/api/Notification`, {
                    headers: new HttpHeaders({
                                               'Authorization': token
                                             })
                  }
              );
        }),
        map((notifications) => {
          console.log(notifications);
          const myNotifications : NotificationModel[] = [];
          for (const key in notifications) {
            if(notifications.hasOwnProperty(key)) {
              myNotifications.push(
                  new NotificationModel(
                      notifications[ key ].id,
                      notifications[ key ].sendingDate,
                      notifications[ key ].text,
                      notifications[ key ].userSenderId,
                      notifications[ key ].userSender,
                      notifications[ key ].userRecipientId,
                      notifications[ key ].userRecipient
                  ));
            }
          }
          const allnotifications : NotificationModel[] = [];
          for (let notification of myNotifications) {
            allnotifications.push(notification);
          }
          console.log(allnotifications);
          return allnotifications;
        }),
        tap(myNotifications => {
          this._myNotifications.next(myNotifications);
        })
    );
  }

  deleteNotification(notificationId: number){
    return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http
              .put(`https://localhost:44397/api/Notification/delete/`+ notificationId, "",{headers: new HttpHeaders({
                                                                                                              'Authorization': token
                                                                                                            })});
        }),
        switchMap(() => {
          return this.myNotifications;
        }),
        take(1),
        tap((notifications) => {
          this._myNotifications.next(notifications.filter((notification) => notification.id !== notificationId));
        })
    );
  }

}
