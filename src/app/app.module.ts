import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import {IonicModule, IonicRouteStrategy, IonInfiniteScroll, IonRow} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {RegisterComponent} from './components/register/register.component';
import {MatDialogModule} from '@angular/material/dialog';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatIconModule} from '@angular/material/icon';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import {MatButtonModule} from '@angular/material/button';
import {AddWatchedMovieComponent} from './components/add-watched-movie/add-watched-movie.component';
import {FriendMovieDetailsComponent} from './components/friend-movie-details/friend-movie-details.component';
import {IdeaMovieDetailsComponent} from './components/idea-movie-details/idea-movie-details.component';
import {MySavedMovieDetailsComponent} from './components/my-saved-movie-details/my-saved-movie-details.component';
import {WatchedMovieDetailsComponent} from './components/watched-movie-details/watched-movie-details.component';
import {UpdateMovieComponent} from './components/update-movie/update-movie.component';
import {FriendMoviesComponent} from './components/friend-movies/friend-movies.component';
import {FriendInfoComponent} from './components/friend-info/friend-info.component';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {UpdateUserComponent} from './components/update-user/update-user.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {CloudinaryModule} from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';
import {PopularMovieDetailsComponent} from './components/popular-movie-details/popular-movie-details.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ScrollToTopComponent} from './components/scroll-to-top/scroll-to-top.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MutualFriendsComponent} from './components/mutual-friends/mutual-friends.component';
import {FriendsWhachedMovieComponent} from './components/friends-whached-movie/friends-whached-movie.component';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        AddWatchedMovieComponent,
        FriendMovieDetailsComponent,
        MySavedMovieDetailsComponent,
        WatchedMovieDetailsComponent,
        UpdateMovieComponent,
        FriendMoviesComponent,
        FriendInfoComponent,
        UpdateUserComponent,
        UserInfoComponent,
        PopularMovieDetailsComponent,
        ScrollToTopComponent,
        WelcomeComponent,
        MutualFriendsComponent,
        IdeaMovieDetailsComponent,
        FriendsWhachedMovieComponent
    ],
    entryComponents: [ScrollToTopComponent],
    imports: [BrowserModule,
              IonicModule.forRoot(),
              AppRoutingModule,
              HttpClientModule,
              BrowserAnimationsModule,
              MatDialogModule,
              NgScrollbarModule,
              MatIconModule,
              SnotifyModule,
              MatButtonModule,
              MatCardModule,
              MatTableModule,
              CarouselModule,
              MatGridListModule,
              MatFormFieldModule,
              MatSelectModule,
              CloudinaryModule.forRoot(Cloudinary, {cloud_name: 'timi11'}),
              InfiniteScrollModule,
              MatTooltipModule,
              MatDatepickerModule,
              MatNativeDateModule,
              MatInputModule,
              NgbModule,
             // NgbModule,
              NgbRatingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        DatePipe,
        MatNativeDateModule,

        // UserService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
        SnotifyService
    ],
    exports: [FormsModule, ScrollToTopComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
