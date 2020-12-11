import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogInPageRoutingModule } from './log-in-routing.module';

import { LogInPage } from './log-in.page';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ProgressButtonModule} from 'progress-button';
import {MatDialogModule} from '@angular/material/dialog';
import {SnotifyModule} from 'ng-snotify';




// import {
//   MatCardModule,
//   MatInputModule,
//   MatButtonModule
// } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogInPageRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ProgressButtonModule,
    MatDialogModule,
    SnotifyModule

  ],
  exports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule
  ],
  declarations: [LogInPage]
})
export class LogInPageModule {}
