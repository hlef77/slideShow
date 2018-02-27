import {
  Component,
  OnInit
} from '@angular/core';

import {
  NgIf
} from '@angular/common';

import {
  Router,
  ActivatedRoute,
  ParamMap
} from '@angular/router';

import {
  MatDialog,
  MatDialogRef
} from '@angular/material';

import 'rxjs/add/operator/switchMap';

import * as firebase from 'firebase';

import {
  AngularFireDatabase
} from 'angularfire2/database';

import {
  AlertDialogComponent
} from '../../components/dialog/alertDialog/alertDialog';
import {
  LoadingDialogComponent
} from '../../components/dialog/loadingDialog/loadingDialog';
import {
  UploadDialogComponent
} from '../../components/dialog/uploadDialog/uploadDialog';

import {
  DownloadSlide
} from '../../models/downloadSlide/downloadSlide';
import {
  UserInfo
} from '../../models/userInfo/userInfo';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './mainMenu.html',
  styleUrls: ['./mainMenu.css']
})
export class MainMenuPageComponent implements OnInit {

  // ログインユーザー名
  userName: string;
  // ユーザ種別
  userKind: string;
  // ロード中判定
  loading: boolean;
  // 検索窓入力文字
  searchBoxText: string;
  // 検索押下時文字列
  searchingUserId: string;
  // 検索中ユーザーのDB参照
  searchUserSlideRef: firebase.database.Reference;
  // 検索にヒットしたスライド名の配列
  hitSlides: Array<string>;
  // ローディングの参照
  loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  // スライドデータ
  slideData: Object;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public downloadSlide: DownloadSlide,
    public userInfo: UserInfo
    ) {
    this.searchBoxText = 'example_user';
  }

  ngOnInit() {
    this.checkLogin();
    this.loadList();
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.userKind = params.get('userKind');
      });
    this.userName = this.userInfo.userName;
  }

  checkLogin = () => {
    if (this.userKind === 'HOST' && (this.userInfo.userId === null || this.userInfo.userId === undefined || this.userInfo.userId === '')) {
      const alertRef = this.dialog.open(AlertDialogComponent, {
        data: {
          alertKind: 'Error',
          message: '有効なホストアカウントで再ログインしてください。'
        }
      });
      alertRef.afterClosed().subscribe(() => {
        this.router.navigate(['login']);
      });
    } else if (this.userInfo.userName === null || this.userInfo.userName === undefined || this.userInfo.userName === '') {
      const alertRef = this.dialog.open(AlertDialogComponent, {
        data: {
          alertKind: 'Error',
          message: '再ログインしてください。'
        }
      });
      alertRef.afterClosed().subscribe(() => {
        this.router.navigate(['login']);
      });
    }
  }

  loadList = () => {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  openUploadDialog = () => {
    const dialogRef = this.dialog.open(UploadDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadList();
      }
    });
  }

  onSearch() {
    this.searchingUserId = this.searchBoxText;
    this.searchUserSlideRef = this.db.database.ref(`/${this.searchingUserId}/slides`);
    this.searchUserSlideRef.on('value', (snapshot) => {
      this.hitSlides = Object.keys(snapshot.val());
    });
  }

  onSlideName = (slideName: string) => {
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {});
    this.loadingDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userInfo.currentSlide = {
          name: slideName,
          author: this.searchingUserId
        };
        this.router.navigate(['slide'], this.slideData);
      }
    });
    let fileUrl: string;
    const searchUserSlideUrlRef = this.db.database.ref(`/${this.searchingUserId}/slides/${slideName}/file`);
    searchUserSlideUrlRef.once('value', (snapshot) => {
      fileUrl = snapshot.val();
    });
    this.download(fileUrl);
  }

  download = (filePath) => {
    if (filePath === null || filePath === undefined || filePath === '') {
      throw Error('ふぁいるぱすが空です');
    }
    const filePathRef: firebase.storage.Reference = firebase.storage().ref(filePath);
    filePathRef.getDownloadURL().then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        this.readJsonFromBlob(blob);
      };
      xhr.open('GET', url);
      xhr.send();

    }).catch((err) => {
      throw Error('だうんろーどえらー: ' + err);
    });
  }

  readJsonFromBlob = (blob: Blob) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      // reader.result contains the contents of blob
      this.downloadSlide.slideData = JSON.parse(reader.result);
      this.loadingDialogRef.close(true);
    });
    reader.readAsText(blob);
  }
}
