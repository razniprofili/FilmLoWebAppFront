import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlertController} from '@ionic/angular';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {AuthService} from '../../auth/auth.service';
import {NgForm} from '@angular/forms';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';

@Component({
  selector: 'app-update-movie',
  templateUrl: './update-movie.component.html',
  styleUrls: ['./update-movie.component.scss'],
})
export class UpdateMovieComponent implements OnInit {

  @ViewChild('form', {static: true}) form: NgForm;

  @Input() dateTimeWatched: any
  @Input() myRate: any
  @Input() myComment: string

  // for notifications:

  style = 'material';
  title = 'Done!';
  body = 'Movie updated!';
  timeout = 3000;
  position: SnotifyPosition = SnotifyPosition.rightBottom;
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

  currentUser: User
  user: UserGet

  rates: Number[] = [1, 2, 3, 4, 5]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UpdateMovieComponent>,
              private alertController: AlertController,
              private watchedMoviesService: WatchedMoviesService,
              private snotifyService: SnotifyService,
              private authService: AuthService) { }

  ngOnInit() {}

  getConfig(): SnotifyToastConfig {
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

  getConfigError(): SnotifyToastConfig {
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

  updateMovie() {
    console.log('clicked!')

    if( this.form.value['rate'] == this.myRate && this.form.value['comment'] == this.myComment && this.form.value['date'] == this.dateTimeWatched) {

      this.dialogRef.close();
      this.snotifyService.success("", "No changes. ", this.getConfig());

    } else {

      if(this.form.value['rate'] == "" || !String(this.form.value['rate']).replace(/\s/g, '').length) {

        this.watchedMoviesService.updateMovie(
            this.data.dataKey,
            Number(this.myRate),
            String(this.form.value['date']),
            this.form.value['comment']).subscribe( (res) => {
              console.log(res)
              this.dialogRef.close();
              this.snotifyService.success(this.body, this.title, this.getConfig());
            },(error => {
              // uspesno = false;
              console.log(error)
              this.dialogRef.close();
              this.snotifyService.error("Error while updating the movie. Movie is not updated.", "Error", this.getConfigError());
            })
        );

      } else {
        if(this.form.value['comment'] == "" || !this.form.value['comment'].replace(/\s/g, '').length) {

          this.watchedMoviesService.updateMovie(
              this.data.dataKey,
              Number(this.form.value['rate']),
              String(this.form.value['date']),
              this.myComment).subscribe( (res) => {
                console.log(res)
                this.dialogRef.close();
                this.snotifyService.success(this.body, this.title, this.getConfig());
              },(error => {
                // uspesno = false;
                console.log(error)
                this.dialogRef.close();
                this.snotifyService.error("Error while updating the movie. Movie is not updated.", "Error", this.getConfigError());
              })
          );

        } else {
          if(this.form.value['date'] == "" || !String(this.form.value['date']).replace(/\s/g, '').length) {

            this.watchedMoviesService.updateMovie(
                this.data.dataKey,
                Number(this.form.value['rate']),
                String(this.dateTimeWatched),
                this.form.value['comment']).subscribe( (res) => {
                  console.log(res)
                  this.dialogRef.close();
                  this.snotifyService.success(this.body, this.title, this.getConfig());
                },(error => {
                  // uspesno = false;
                  console.log(error)
                  this.dialogRef.close();
                  this.snotifyService.error("Error while updating the movie. Movie is not updated.", "Error", this.getConfigError());
                })
            );

          }
          else {
            this.watchedMoviesService.updateMovie(
                this.data.dataKey,
                Number(this.form.value['rate']),
                String(this.form.value['date']),
                this.form.value['comment']).subscribe( (res) => {
                  console.log(res)
                  this.dialogRef.close();
                  this.snotifyService.success(this.body, this.title, this.getConfig());
                },(error => {
                  // uspesno = false;
                  console.log(error)
                  this.dialogRef.close();
                  this.snotifyService.error("Error while updating the movie. Movie is not updated.", "Error", this.getConfigError());
                })
            );
          }
        }
      }

    }


  }
}
