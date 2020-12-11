import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import {IonicModule, IonicRouteStrategy, IonInfiniteScroll} from '@ionic/angular';
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


@NgModule({
  declarations: [AppComponent, RegisterComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    BrowserAnimationsModule, MatDialogModule, NgScrollbarModule, MatIconModule, SnotifyModule, MatButtonModule],
  providers: [
    StatusBar,
    SplashScreen,
    // UserService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  exports : [FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
