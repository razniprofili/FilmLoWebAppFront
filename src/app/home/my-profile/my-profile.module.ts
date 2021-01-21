import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfilePageRoutingModule } from './my-profile-routing.module';

import { MyProfilePage } from './my-profile.page';
import {MatIconModule} from '@angular/material/icon';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {SnotifyModule} from 'ng-snotify';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
              imports: [
                  CommonModule ,
                  FormsModule ,
                  IonicModule ,
                  MyProfilePageRoutingModule ,
                  MatIconModule ,
                  NgScrollbarModule ,
                  MatMenuModule ,
                  MatCardModule ,
                  MatButtonModule ,
                  SnotifyModule ,
                  MatBadgeModule ,
                  MatTooltipModule
              ],
  declarations: [MyProfilePage]
})
export class MyProfilePageModule {}
