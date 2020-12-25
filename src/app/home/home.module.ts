import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {SnotifyModule} from 'ng-snotify';
import {CarouselModule} from 'ngx-owl-carousel-o';
// import {NgScrollbarModule} from 'ngx-scrollbar';
// import {MaterialModule} from '@angular/material;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    // MaterialModule,
    MatBadgeModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgScrollbarModule,
    SnotifyModule,
    CarouselModule,
    // NgScrollbarModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
