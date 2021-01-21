import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyFriendsPageRoutingModule } from './my-friends-routing.module';

import { MyFriendsPage } from './my-friends.page';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatCardModule} from '@angular/material/card';
import {SnotifyModule} from 'ng-snotify';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
              imports: [
                  CommonModule ,
                  FormsModule ,
                  IonicModule ,
                  MyFriendsPageRoutingModule ,
                  MatIconModule ,
                  MatMenuModule ,
                  NgScrollbarModule ,
                  MatCardModule ,
                  SnotifyModule ,
                  MatGridListModule ,
                  MatBadgeModule ,
                  MatButtonModule ,
                  MatTooltipModule
              ],
  declarations: [MyFriendsPage]
})
export class MyFriendsPageModule {}
