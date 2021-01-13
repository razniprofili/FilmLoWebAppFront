import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {SnotifyPosition, SnotifyService, SnotifyToastConfig} from 'ng-snotify';
import axios from 'axios';

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
  @ViewChild('fileBtn') fileBtn: {
    nativeElement: HTMLInputElement
  }

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

    var newImg = document.getElementById('userPic') as HTMLImageElement

    if(this.form.value['name'] ==""){
      this.userService.updateUser(this.myName, newImg.src, this.form.value['surname']).subscribe( (res) => {
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
    } else {
      if(this.form.value['surname'] ==""){
        this.userService.updateUser(this.form.value['name'], newImg.src, this.mySurname).subscribe( (res) => {
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
      } else {
        this.userService.updateUser(this.form.value['name'], newImg.src, this.form.value['surname']).subscribe( (res) => {
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


  }

  uploadPic(event) {


    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/timi11/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'mdrb0x8n';

    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('folder', 'filmlo_users');

    let picUrl = ""
    var newImg = document.getElementById('userPic') as HTMLImageElement

    axios.post(CLOUDINARY_URL, data).then(function(res) {
      console.log(res.data)
      console.log(res.data.secure_url)
      picUrl = res.data.secure_url

      newImg.src = picUrl
      console.log(picUrl)

    }).catch(function(err) {
      console.error(err)
    });

    // second way:
// try {
//   fetch(CLOUDINARY_URL, {
//     method: 'POST',
//     mode: 'no-cors',
//     body: data
//   }).then(function(res) {
//     console.log(res)
//   })
//       // .then(response => response.json()).then(res => {
//       //   console.log(res)
//       //   // if (data.secure_url !== '') {
//       //   //   const uploadedFileUrl = data.secure_url;
//       //   //   console.log(data.secure_url)
//       //   //   localStorage.setItem('passportUrl', uploadedFileUrl);
//       //   // }
//       // });
// } catch(err) {
//  console.error(err)
// };

  }

}
