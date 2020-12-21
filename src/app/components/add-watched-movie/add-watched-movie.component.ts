import {Component, Inject, NgModule, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlertController} from '@ionic/angular';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import {WatchedMoviesService} from '../../home/services/watched-movies.service';
import {FormsModule, NgForm} from '@angular/forms';
import {Movie} from '../../home/models/movie.model';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';
import {UserGet} from '../../auth/user-get.model';

// @NgModule({
//   declarations: [],
//   imports: [],
//   providers: [],
//   exports: [FormsModule],
//   bootstrap: []
// })
@Component({
  selector: 'app-add-watched-movie',
  templateUrl: './add-watched-movie.component.html',
  styleUrls: ['./add-watched-movie.component.scss'],
})
export class AddWatchedMovieComponent implements OnInit {

 @ViewChild('form', {static: true}) form: NgForm;

    // for notifications:

    style = 'material';
    title = 'Done!';
    body = 'Movie added to watched movies!';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AddWatchedMovieComponent>,
              private alertController: AlertController,
              private watchedMoviesService: WatchedMoviesService,
              private snotifyService: SnotifyService,
              private authService: AuthService) { }

  ngOnInit() {

      this.authService.currentUser.subscribe(user => {
          this.currentUser = user;
          console.log(user);
      });

      this.authService.getUser(this.currentUser.id).subscribe(user => {
          this.user = user;
      });
  }

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

    addMovie(){

      let movieDetails = this.data.dataKey

       let movie = new Movie(movieDetails.imdbID, movieDetails.Actors, Number(movieDetails.Year), movieDetails.Title, movieDetails.Director,
           Number(movieDetails.Runtime.substring(0, movieDetails.Runtime.length-4)), movieDetails.Genre, movieDetails.Country,
           Number(this.form.value['rate']), this.form.value["comment"],
           this.form.value['date'], new Date(), movieDetails.Poster, this.user)
console.log(movie)
      this.watchedMoviesService.addWatchedMovie(movie).subscribe( () => {

              //  uspesno = true;
              this.dialogRef.close();
              this.snotifyService.success(this.body, this.title, this.getConfig());
          },
          (error => {
              // uspesno = false;
              console.log(error)
              this.dialogRef.close();

              if(error.error.erroe == "WatchedMovie currently exists!") {

                  this.snotifyService.error("This movie already exists in the watch list. You can't add it!", "Error", this.getConfigError());

              } else {

                  this.snotifyService.error("Error while adding the movie. Movie is not added.", "Error", this.getConfigError());
              }

          }));

  }
}
