import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyWatchedMoviesPageRoutingModule } from './my-watched-movies-routing.module';

import { MyWatchedMoviesPage } from './my-watched-movies.page';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatCardModule} from '@angular/material/card';
import {SnotifyModule} from 'ng-snotify';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
              imports: [
                  CommonModule ,
                  FormsModule ,
                  IonicModule ,
                  MyWatchedMoviesPageRoutingModule ,
                  MatIconModule ,
                  MatMenuModule ,
                  NgScrollbarModule ,
                  MatCardModule ,
                  SnotifyModule ,
                  MatButtonModule ,
                  MatGridListModule ,
                  MatBadgeModule ,
                  MatTooltipModule
              ],
  declarations: [MyWatchedMoviesPage]
})
export class MyWatchedMoviesPageModule {}
