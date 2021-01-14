
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationComponent} from '../../components/notification/notification.component';
import {MatDialog} from '@angular/material/dialog';
import {RegisterComponent} from '../../components/register/register.component';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  email1: string;
  password1: string;
  error = false;

    // for notifications:

    style = 'material';
    title = 'Success!';
    body = 'Movie removed from the list!';
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

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController,
              private snackBar: MatSnackBar, private matDialog: MatDialog, public alert: AlertController,
              private snotifyService: SnotifyService) { }

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

    openRegister(): void {
        const dialogRef = this.matDialog.open(RegisterComponent, {
            role: 'dialog',
            height: '380px',
            width: '480px'
        });
    }

    async onLogIn(form: NgForm) {
        const{email1, password1} = this;
        if (form.valid) {

            this.authService.login(form.value).subscribe((resData) => {
                                                             console.log(resData);
                                                             console.log('uspesna prijava');
                                                             this.error = false;
                                                             this.router.navigateByUrl('/home');
                                                         },
                                                         errRes => {
                                                             console.log(errRes)
                                                             this.error = true;
                                                             this.snotifyService.error(errRes.error.erroe, "Error", this.getConfigError());
                                                         });
        }
    }


    //unused but useful things:

    async presentAlert(title: string, content: string) {
        const alert = await this.alert.create({
            header: title,
            message: content,
            buttons: ['OK']
        });

        await alert.present();
    }

    openSnackBar(message: string, action: string, duration: number, verticalPos: any, horizontalPos: any){
     let snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
         data: {
           message: message,
           buttonText: action
         },
         duration: duration,
         verticalPosition: verticalPos,
        // horizontalPosition: horizontalPos,
         panelClass : 'bar'
     });

     snackBarRef.afterDismissed().subscribe(() => {
         console.log('Dismissed!')
     });

      snackBarRef.onAction().subscribe(() => {
          console.log('Action')
      });
  }

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        // Default parameters
        slidesPerView: 1,
        spaceBetween: 10,
        // Responsive breakpoints
        // breakpoints: {
        //   // when window width is >= 320px
        //   320: {
        //     slidesPerView: 2,
        //     spaceBetween: 20
        //   },
        //   // when window width is >= 480px
        //   480: {
        //     slidesPerView: 3,
        //     spaceBetween: 30
        //   },
        //   // when window width is >= 640px
        //   640: {
        //     slidesPerView: 4,
        //     spaceBetween: 40
        //   }
        // }
    };

    progressData = {
        animation: 'shrink',
        direction: 'horizontal',
    }

    designData = {
        background: '#f7900a',
        color: '#FFFFFF',
        successBackground: '#00e175',
        errorBackground: '#ff0c00',
        successIconColor: '#ffffff',
        errorIconColor: '#ffffff',
        progressBackground: '#000000',
        progressInnerBackground: 'rgba(255, 255, 255,0.5)',
        radius:50
    }

    run = (instance)=>{
        let progress = 0;
        // initialize the progress
        instance.progressInit();
        // This is an example of interval useful to set the progress value
        const interval = setInterval(() => {
            progress += 5;
            // set the progress value
            instance.progressValue = progress;
            if (progress === 100) {
                // stop the progress with success status
                const sub = instance.progressStop('success').subscribe({
                    complete() {
                        sub.unsubscribe();
                    }
                });
                clearInterval(interval);
            }
        }, 200);
    }
}
