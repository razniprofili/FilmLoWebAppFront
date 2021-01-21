import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySavedMoviesPageRoutingModule } from './my-saved-movies-routing.module';

import { MySavedMoviesPage } from './my-saved-movies.page';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
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
                  MySavedMoviesPageRoutingModule ,
                  MatIconModule ,
                  MatMenuModule ,
                  NgScrollbarModule ,
                  MatCardModule ,
                  MatTableModule ,
                  SnotifyModule ,
                  MatButtonModule ,
                  MatGridListModule ,
                  MatBadgeModule ,
                  MatTooltipModule
              ],
  declarations: [MySavedMoviesPage]
})
export class MySavedMoviesPageModule {}
