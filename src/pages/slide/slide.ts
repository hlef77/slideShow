import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFireDatabase
} from 'angularfire2/database';

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
  DownloadSlide,
  SLIDECONTENTS,
  SLIDEDATA
} from '../../models/downloadSlide/downloadSlide';
import {
  UserInfo
} from '../../models/userInfo/userInfo';

@Component({
  selector: 'app-slide-page',
  templateUrl: './slide.html',
  styleUrls: ['./slide.css']
})
export class SlidePageComponent implements OnInit {

  slideTitle: string;
  slideContents: SLIDECONTENTS;

  currentTitle: string;
  currentContents;

  displayItem = [];

  // currentPosition;

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
    console.log('INIT!');
    this.checkLogin();
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.slideTitle = this.slideData.slideData.slide_title;
        this.slideContents = this.slideData.slideData.slide_contents;
      });

    // this.currentPosition = {
    //   page: 0,
    //   point: 0
    // };

    this.positionRef = this.db.database.ref(`/${this.userInfo.currentSlide.author}/slides/${this.userInfo.currentSlide.name}/position`);
    this.positionRef.on('value', (snapshot) => {
      const position = snapshot.val();
      // console.log(this.currentPosition.point + ':' + position.point);
      // if (this.currentPosition.page !== position.page) {
        this.onChangePage();
      // }
      // if (this.currentPosition.point !== position.point) {
        this.onChangePoint(position.point);
      // }
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

  changeFullScreen = () => {
    const elem = document.getElementById('slide-display');
    console.log(elem);
    if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    }
  }

  backToMainMenu = () => {
    this.router.navigate(['mainMenu', '']);
  }

  loadSlidePage = (page: number) => {
    this.currentTitle = this.slideContents[page].title;
    this.setSlideContent(page);
  }

  setSlideContent = (page: number) => {
    let contentsHtml = '';
    this.slideContents[page].contents.forEach((item, index) => {
      if (Object.keys(item)[0] = 'text') {
        contentsHtml += '<div id="slide-page-content-' + (index + 1) + '" style=display:none>' + item.text + '</div>';
      }
      this.displayItem[index] = false;
    });
    document.getElementById('slide-contents').innerHTML = contentsHtml;
    console.log();
  }

  next = () => {
    // this.currentPosition.point += 1;
    let currentPoint;
    this.positionRef.child('/point').once('value', (snapshot) => {
      currentPoint = snapshot.val();
    });
    this.positionRef.child('/point').set(currentPoint + 1);
  }

  onChangePage = () => {

  }

  onChangePoint = (point) => {
    if (point <= this.slideContents[0].contents.length) {
      document.getElementById('slide-page-content-' + point).style.display = '';
    }
  }

  reset = () => {
    this.positionRef.set({
      page: 0,
      point: 0
    });
  }
}
