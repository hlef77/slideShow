import {
  Component,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

import * as firebase from 'firebase';

import {
  UserInfo
} from '../../../models/userInfo/userInfo';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './uploadDialog.html',
  styleUrls: ['./uploadDialog.css'],
})
export class UploadDialogComponent {

  file: File;

  constructor(
    public dialogRef: MatDialogRef < UploadDialogComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private userInfo: UserInfo
  ) {}

  onCancel = (): void => {
    this.dialogRef.close(false);
  }

  onUpload = (): void => {
    // フォルダ名、ファイル名を指定して参照を作成する
    const storageRef = firebase.storage().ref(`upload_files/${this.userInfo.userId}/${this.file.name}`);

    // putメソッドでファイルをアップロード
    // 結果はPromiseで取得可能
    storageRef.put(this.file).then(result => {
        // ここではアップロー済みの画像を表示するため結果をメンバ変数に格納
        this.openSnackBar('Upload Complete!');
        console.log(result);
        this.dialogRef.close(true);
      })
      .catch(err => console.log(err));
  }

  onChangeInput(evt) {
    this.file = evt.target.files[0];
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
