import {
  Component,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

import {
  AngularFireDatabase
} from 'angularfire2/database';

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

  // 入力ファイル名
  fileName: string;

  constructor(
    private db: AngularFireDatabase,
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
    const strageFilePath = `upload_files/${this.userInfo.userId}/${this.file.name}`;
    const storageRef = firebase.storage().ref(strageFilePath);

    // putメソッドでファイルをアップロード
    // 結果はPromiseで取得可能
    storageRef.put(this.file).then(result => {
        const userRef = this.db.database.ref(`/${this.userInfo.userId}/slides/`);
        userRef.set({
          [this.fileName]: {
            clients: '',
            file: strageFilePath,
            position: {
              page: 0,
              point: 0,
            },
            receive_data: ''
          }
        });

        // 完了のスナックバー表示
        this.openSnackBar('Upload Complete!');
        // ダイアログを閉じる
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
