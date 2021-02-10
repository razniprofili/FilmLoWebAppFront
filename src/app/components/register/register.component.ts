import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {WelcomeComponent} from '../welcome/welcome.component';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RegisterComponent>,
              private authService: AuthService,
              private router: Router,
              private matDialog: MatDialog,
              private snotifyService: SnotifyService) { }

  @ViewChild('form', {static: true}) form: NgForm;

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


  ngOnInit() {}

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

  register() {

    if(this.form.value[ 'name' ] == '' || this.form.value[ 'surname' ] == '' || this.form.value[ 'email' ] == '' || this.form.value[ 'password' ] == '') {
      this.snotifyService.error('You must fulfil all fields!', '', this.getConfigError());
    } else {

      if(!/^[a-zA-ZšŠžŽćĆčČđĐ]+$/.test(this.form.value[ 'name' ]) || !/^[a-zA-ZšŠžŽćĆčČđĐ]+$/.test(this.form.value[ 'surname' ])) {
        this.snotifyService.error('Name and surname can only contain letters!', '', this.getConfigError());
      } else {
        if(!this.validateEmail(this.form.value[ 'email' ])) {
          this.snotifyService.error('Invalid email address!', '', this.getConfigError());

        } else {

          if(this.form.value[ 'password' ].length < 8) {
            this.snotifyService.error('Password minimum length is 8 characters', '', this.getConfigError());
          } else {
            this.authService.register({
                                        name: this.form.value[ 'name' ],
                                        surname: this.form.value[ 'surname' ],
                                        email: this.form.value[ 'email' ],
                                        password: this.form.value[ 'password' ]
                                      }).subscribe(resData => {
                                                     console.log(resData);
                                                     this.dialogRef.close();
                                                     this.router.navigateByUrl('/home');
                                                     const dialogRef = this.matDialog.open(WelcomeComponent, {
                                                       role: 'dialog',
                                                       height: '380px',
                                                       width: '480px',
                                                       data: {
                                                         dataKey: {
                                                           name: this.form.value[ 'name' ],
                                                           surname: this.form.value[ 'surname' ],
                                                           email: this.form.value[ 'email' ],
                                                           password: this.form.value[ 'password' ]
                                                         },
                                                       }
                                                     });

                                                   },
                                                   (error) => {
                                                     console.log(error);
                                                     const errorMessage = error.error.erroe;
                                                     console.log(errorMessage);
                                                     this.snotifyService.error(errorMessage, 'Error', this.getConfigError());
                                                   });
          }
        }
      }
    }
  }

  validateEmail(email): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
