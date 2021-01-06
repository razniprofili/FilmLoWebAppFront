import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatisticsPageRoutingModule } from './statistics-routing.module';

import { StatisticsPage } from './statistics.page';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {SnotifyModule} from 'ng-snotify';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StatisticsPageRoutingModule,
        MatIconModule,
        MatMenuModule,
        MatCardModule,
        NgScrollbarModule,
        SnotifyModule,
        MatTableModule,
        MatButtonModule,
        MatBadgeModule
    ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
