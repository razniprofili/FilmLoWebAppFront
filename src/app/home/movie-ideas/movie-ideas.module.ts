import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovieIdeasPageRoutingModule } from './movie-ideas-routing.module';

import { MovieIdeasPage } from './movie-ideas.page';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MatCardModule} from '@angular/material/card';
import {SnotifyModule} from 'ng-snotify';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MovieIdeasPageRoutingModule,
        MatIconModule,
        MatMenuModule,
        NgScrollbarModule,
        MatCardModule,
        SnotifyModule,
        MatGridListModule,
        MatBadgeModule,
        MatButtonModule
    ],
    exports: [FormsModule],
  declarations: [MovieIdeasPage],

})
export class MovieIdeasPageModule {}
