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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyFriendsPageRoutingModule,
        MatIconModule,
        MatMenuModule,
        NgScrollbarModule,
        MatCardModule
    ],
  declarations: [MyFriendsPage]
})
export class MyFriendsPageModule {}
