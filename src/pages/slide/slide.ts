import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFireDatabase
} from 'angularfire2/database';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import {
  Router,
  ActivatedRoute,
  ParamMap
} from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {
  MatDialog
} from '@angular/material';

import {
  FirebaseApp
} from 'angularfire2/firebase.app.module';
import {
  async
} from '@angular/core/testing';

import {
  AlertDialogComponent
} from '../../components/dialog/alertDialog/alertDialog';
import {
  ConfirmDialogComponent
} from '../../components/dialog/confirmDialog/confirmDialog';
import {
  GraphDialogComponent
} from '../../components/dialog/graphDialog/graphDialog';

import {
  DownloadSlide,
  SLIDECONTENTS,
  SLIDEDATA
} from '../../models/downloadSlide/downloadSlide';
import {
  UserInfo
} from '../../models/userInfo/userInfo';
import {
  ChoiceDialogComponent
} from '../../components/dialog/choiceDialog/choiceDialog';

interface Position {
  page: number;
  point: number;
}

@Component({
  selector: 'app-slide-page',
  templateUrl: './slide.html',
  styleUrls: ['./slide.css'],
  animations: [
    trigger('animation', [
      state('active', style({
        opacity: 1
      })),
      transition('void => *', [style({
        opacity: 0
      }), animate(300)]),
    ])
  ]
})
export class SlidePageComponent implements OnInit {

  // SHOWかWATCHか
  isHost: boolean;
  // 画面のスライドタイトル
  slideTitle: string;
  // スライド情報の中身
  slideContents: SLIDECONTENTS;

  slideInfoArray: Array < string > = [];

  // 現在のスライドページのタイトル
  currentTitle: string;

  // 現在位置を保持する
  currentPosition: Position = {
    page: 0,
    point: 0
  };

  // DBのスライド位置の値の参照
  positionRef: firebase.database.Reference;

  constructor(
    private db: AngularFireDatabase,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private slideData: DownloadSlide,
    private userInfo: UserInfo
  ) {}

  ngOnInit() {
    this.checkLogin();

    // メインメニュー画面から渡されたパラメータの取得
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        // モード設定
        const mode = params.get('mode');
        if (mode === 'SHOW') {
          this.isHost = true;
        } else {
          this.isHost = false;
        }
      });

    // スライド情報の取得
    this.slideTitle = this.slideData.slideData.slide_title;
    this.slideContents = this.slideData.slideData.slide_contents;

    console.log(JSON.stringify(this.slideContents, null, 2));

    // スライド位置の参照の取得
    this.positionRef = this.db.database.ref(`/${this.userInfo.currentSlide.author}/slides/${this.userInfo.currentSlide.name}/position`);

    // 一度初期状態を確認
    if (this.isHost) {
      this.positionRef.once('value', (snapshot) => {
        const position: Position = snapshot.val();
        if (position.page !== 0 || position.point !== 0) {
          const alertRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              message: 'このスライドの発表位置情報が初期状態ではありません。初期化しますか？'
            }
          });
          alertRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result === 'YES') {
              // DBのポジション初期化
              this.positionRef.child('page').set(0);
              this.positionRef.child('point').set(0);
              this.slideInfoArray = [];
            } else if (result === 'NO') {
              // 処理継続
            } else {
              // キャンセル時
              this.backToMainMenu();
            }
          });
        }
      });
    }


    this.positionRef.on('value', (snapshot) => {
      const position = snapshot.val();
      this.onChangePage();
      this.onChangePoint(position.point);
    });

    this.loadSlidePage(0);

  }

  checkLogin = () => {
    if (this.userInfo.userName === null || this.userInfo.userName === undefined || this.userInfo.userName === '') {
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

  // スライドをフルスクリーン表示する
  changeFullScreen = () => {
    const elem = document.getElementById('slide-display');
    if (elem.webkitRequestFullScreen) {
      // ChromeとスマホのSleipnirでしか挙動は確認していない
      elem.webkitRequestFullScreen();
    }
  }

  backToMainMenu = () => {
    // メインメニュー画面に戻る
    let userKind;
    if (this.isHost) {
      userKind = 'HOST';
    } else {
      userKind = 'GUEST';
    }
    this.router.navigate(['mainMenu', userKind]);
  }

  loadSlidePage = (page: number) => {
    // 該当ページのタイトルのセット
    this.currentTitle = this.slideContents[page].title;
  }

  next = () => {
    if (!this.isHost) {
      // スライド操作権限なし
      return;
    }

    // this.currentPosition.point += 1;
    this.positionRef.child('/point').once('value', (snapshot) => {
      const currentPoint = snapshot.val();
      this.positionRef.child('/point').set(currentPoint + 1);
    });
  }

  onChangePage = () => {

  }

  onChangePoint = (point) => {
    if (point !== 0 && point <= this.slideContents[0].contents.length) {
      const pointContent = this.slideContents[0].contents[point - 1];
      const kind = Object.keys(pointContent)[0];
      if (kind === 'text') {
        this.slideInfoArray.push(pointContent.text);
      } else if (kind === 'choice') {
        // 質問内容を取得
        const data = pointContent.choice;

        // db初期値設定
        const firstSet = {
          [data.id]: {}
        };
        const itemsObj = firstSet[data.id];
        data.items.forEach(item => {
          itemsObj[item] = 0;
        });
        const rdRef = this.db.database.ref(`/${this.userInfo.currentSlide.author}/slides/${this.userInfo.currentSlide.name}/receive_data`);
        rdRef.set(firstSet);

        const choiceRef = this.dialog.open(ChoiceDialogComponent, {
          data: {
            title: '質問',
            message: data.message,
            items: data.items,
          }
        });
        choiceRef.afterClosed().subscribe((result) => {
          // db送信
          if (result) {
            rdRef.child(`${data.id}/${result}`).once('value', (snapshot) => {
              rdRef.child(`${data.id}/${result}`).set(snapshot.val() + 1);
            });
          }
        });
      } else if (kind === 'graph') {
        const data = pointContent.graph;
        const ref = `/${this.userInfo.currentSlide.author}/slides/${this.userInfo.currentSlide.name}/receive_data/${data.dataId}`;
        const rdRef = this.db.database.ref(ref);
        const graphData = rdRef.once('value', (snapshot) => {
          const graphRef = this.dialog.open(GraphDialogComponent, {
            data: {
              name: data.name,
              graphData: snapshot.val()
            }
          });
        });
      }
    }
  }

  reset = () => {
    if (!this.isHost) {
      // スライド操作権限なし
      return;
    }

    this.positionRef.set({
      page: 0,
      point: 0
    });
  }
}
