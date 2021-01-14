import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlertController} from '@ionic/angular';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {AuthService} from '../../auth/auth.service';
import {NgForm} from '@angular/forms';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-update-movie',
  templateUrl: './update-movie.component.html',
  styleUrls: ['./update-movie.component.scss'],
})
export class UpdateMovieComponent implements OnInit {

  @ViewChild('form', {static: true}) form : NgForm;

  @Input() textValue : any
  @Input() currentRate : any
  @Input() myComment : string

  dateWatched = this.textValue

  // for notifications:

  style = 'material';
  title = 'Done!';
  body = 'Movie updated!';
  timeout = 3000;
  position : SnotifyPosition = SnotifyPosition.rightBottom;
  progressBar = true;
  closeClick = true;
  newTop = true;
  filterDuplicates = false;
  backdrop = -1;
  dockMax = 8;
  blockMax = 6;
  pauseHover = true;
  titleMaxLength = 15;
  bodyMaxLength = 80;

  currentUser : User
  user : UserGet

  rates : Number[] = [1, 2, 3, 4, 5]

  noComment


  constructor(@Inject(MAT_DIALOG_DATA) public data : any,
              public dialogRef : MatDialogRef<UpdateMovieComponent>,
              private alertController : AlertController,
              private watchedMoviesService : WatchedMoviesService,
              private snotifyService : SnotifyService,
              private authService : AuthService,
              private config : NgbRatingConfig) {
    config.max = 5
  }

  ngOnInit() {
    console.log(this.textValue)
  }

  getConfig() : SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax,
        // @ts-ignore
        filterDuplicates: this.filterDuplicates
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }

  getConfigError() : SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax,
        // @ts-ignore
        filterDuplicates: this.filterDuplicates
      }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: 0,
      showProgressBar: false,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover
    };
  }

  closeDialog() {
    this.dialogRef.close()
  }

  updateMovie() {

    // check white spaces : !this.form.value['comment'].replace(/\s/g, '').length

    console.log('clicked!')
    console.log(this.textValue, this.currentRate, this.myComment)

    if( this.textValue == "") {
      this.noComment = true
    } else {
      this.noComment = false
      this.watchedMoviesService.updateMovie(
          this.data.dataKey,
          this.currentRate,
          new DatePipe('en').transform(this.textValue, 'dd.MM.yyyy.'),
          this.form.value[ 'comment' ]
      ).subscribe((res) => {
            console.log(res)
            this.dialogRef.close();
            this.snotifyService.success(this.body, this.title, this.getConfig());
          }, (error => {
            // uspesno = false;
            console.log(error)
            this.dialogRef.close();
            this.snotifyService.error("Error while updating the movie. Movie is not updated.", "Error", this.getConfigError());
          })
      );
    }
  }
}
