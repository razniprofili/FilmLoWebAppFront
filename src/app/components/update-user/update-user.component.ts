import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {

  @ViewChild('form', {static: true}) form: NgForm;

  @Input() myName: string
  @Input() mySurname: string
  @Input() myPicture: string

  // for notifications:

  style = 'material';
  title = 'Done!';
  body = 'Your profile is updated!';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UpdateUserComponent>,
              private userService: AuthService,
              private snotifyService: SnotifyService) { }

  userId = this.data.dataKey

  ngOnInit() {

    console.log(this.myName)
    console.log(this.mySurname)
    console.log(this.myPicture)

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

  updateUser(){

    this.userService.updateUser(this.form.value['name'], this.myPicture, this.form.value['surname']).subscribe( (res) => {
          console.log(res)
          this.dialogRef.close();
          this.snotifyService.success(this.body, this.title, this.getConfig());
        },(error => {
          // uspesno = false;
          console.log(error)
          this.dialogRef.close();
          this.snotifyService.error("Error while updating profile. Profile data is not updated.", "Error", this.getConfigError());
        })
    );

  }


}
