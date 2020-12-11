import { Injectable } from '@angular/core';
import {
    CanLoad,
    Route,
    UrlSegment,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {take, tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {
    constructor(private authService: AuthService, private router: Router) {
    }
    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

        return this.authService.isUserAuth.pipe(
            take(1), // ogranicavamo na jedan
            tap(isAuth => { //upravljm vracanjem na stranicu log-in
                if (!isAuth) {
                    this.router.navigateByUrl('/log-in');
                }
            }));
        // if (!this.authService.isUserAuth) {
        //   this.router.navigateByUrl('/log-in');
        // }
        // return this.authService.isUserAuth;
    }
}
