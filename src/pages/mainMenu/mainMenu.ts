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
  hostListLoading: boolean;
  searchSlideLoading: boolean;
  // 検索窓入力文字
  searchBoxText: string;
  // 検索押下時文字列
  searchingUserId: string;
  // ヒットしたスライド名の配列
  hitHostSlides: Array < string > ;
  hitSearchSlides: Array < string > ;
  // ローディングの参照
  loadingDialogRef: MatDialogRef < LoadingDialogComponent > ;
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
    this.searchBoxText = '';
  }

  ngOnInit() {
    // ログイン画面から渡されたパラメータの取得
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.userKind = params.get('userKind');
      });
    // ログイン状態の確認
    this.checkLogin();
    // 画面にユーザー名を表示
    this.userName = this.userInfo.userName;
  }

  checkLogin = () => {
    if (this.userKind === 'HOST' && (this.userInfo.userId === null || this.userInfo.userId === undefined || this.userInfo.userId === '')) {
      // ホストアカウントがIDを持っていない場合
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
      // nameを持っていない場合
      const alertRef = this.dialog.open(AlertDialogComponent, {
        data: {
          alertKind: 'Error',
          message: '再ログインしてください。'
        }
      });
      alertRef.afterClosed().subscribe(() => {
        this.router.navigate(['login']);
      });
    } else if (this.userKind === 'HOST') {
      // 有効なホストアカウントの場合
      // 自分のアップロード済みスライドリストの取得
      this.loadHostList();
    }
  }

  loadHostList = () => {
    // ぐるぐるの表示
    this.hostListLoading = true;

    // アップロード済みスライド情報の取得
    const hostSlidesRef = this.db.database.ref(`/${this.userInfo.userId}/slides`);
    hostSlidesRef.once('value', (slidesSnapshot) => {
      if (slidesSnapshot.val() !== null && slidesSnapshot.val() !== undefined) {
        // 一つでも存在する場合
        // リストに表示
        this.hitHostSlides = Object.keys(slidesSnapshot.val());
        // ぐるぐるの非表示
        this.hostListLoading = false;
      } else {
        // 存在しない場合
        // ぐるぐるの非表示
        this.hostListLoading = false;
      }
    });
  }

  openUploadDialog = () => {
    const dialogRef = this.dialog.open(UploadDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadHostList();
      }
    });
  }

  onSearch() {
    // リストの初期化
    this.hitSearchSlides = [];
    // ぐるぐるの表示
    this.searchSlideLoading = true;

    // 検索押下時のユーザーIDを格納
    this.searchingUserId = this.searchBoxText;

    const rootRef = this.db.database.ref(`/`);
    rootRef.once('value', (rootSnapshot) => {
      console.log('search to ' + `${this.searchingUserId}`);
      if (rootSnapshot.hasChild(`${this.searchingUserId}`)) {
        // 存在する場合
        const searchUserSlideRef = this.db.database.ref(`/${this.searchingUserId}/slides/`);
        searchUserSlideRef.once('value', (slidesSnapshot) => {
          this.hitSearchSlides = Object.keys(slidesSnapshot.val());
          // ぐるぐるの非表示
          this.searchSlideLoading = false;
        });
      } else {
        // 存在しない場合
        // ぐるぐるの非表示
        this.searchSlideLoading = false;
      }
    });
  }

  onSlideName = (slideName: string, mode: string) => {
    // ローディングの表示
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {});

    // ローディングのclose()後の挙動
    this.loadingDialogRef.afterClosed().subscribe(result => {
      // close(true)であれば
      if (result) {
        // スライド画面に遷移
        this.router.navigate(['slide', mode]);
      }
    });

    let fileUrl: string;
    if (mode === 'SHOW') {
      // SHOWタブ内で押下された場合(ホストが自身のスライドを選択した場合)
      const ownSlideUrlRef = this.db.database.ref(`/${this.userInfo.userId}/slides/${slideName}/file`);
      ownSlideUrlRef.once('value', (snapshot) => {
        this.download(snapshot.val());
        // 現在のスライド情報を保持
        this.userInfo.currentSlide = {
          name: slideName,
          author: this.userInfo.userId
        };
      });
    } else {
      // WATCHタブ内で押下された場合
      const searchUserSlideUrlRef = this.db.database.ref(`/${this.searchingUserId}/slides/${slideName}/file`);
      searchUserSlideUrlRef.once('value', (snapshot) => {
        fileUrl = snapshot.val();
        this.download(snapshot.val());
        // 現在のスライド情報を保持
        this.userInfo.currentSlide = {
          name: slideName,
          author: this.searchingUserId
        };
      });
    }
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
