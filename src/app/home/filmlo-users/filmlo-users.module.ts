import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilmloUsersPageRoutingModule } from './filmlo-users-routing.module';

import { FilmloUsersPage } from './filmlo-users.page';
import {SnotifyModule} from 'ng-snotify';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
              imports: [
                  CommonModule ,
                  FormsModule ,
                  IonicModule ,
                  FilmloUsersPageRoutingModule ,
                  SnotifyModule ,
                  MatCardModule ,
                  MatIconModule ,
                  NgScrollbarModule ,
                  MatMenuModule ,
                  MatBadgeModule ,
                  MatButtonModule ,
                  MatTooltipModule
              ],
  declarations: [FilmloUsersPage]
})
export class FilmloUsersPageModule {}
