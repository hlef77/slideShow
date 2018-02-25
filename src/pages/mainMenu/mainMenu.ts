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
  MatDialog
} from '@angular/material';

import 'rxjs/add/operator/switchMap';

import {
  AngularFireDatabase
} from 'angularfire2/database';

import {
  UploadDialogComponent
} from '../../components/dialog/uploadDialog/uploadDialog';
import {
  AlertDialogComponent
} from '../../components/dialog/alertDialog/alertDialog';

import {
  UserInfo
} from '../../models/userInfo/userInfo';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './mainMenu.html',
  styleUrls: ['./mainMenu.css']
})
export class MainMenuPageComponent implements OnInit {

  userName: string;
  userKind: string;
  loading: boolean;
  searchText: string;
  hitSlides: Array<string>;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private userInfo: UserInfo
  ) {
    this.searchText = 'example_user';
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

  async onSearch() {
    const searchUserSlideRef = this.db.database.ref(`/${this.searchText}/slides`);
    await searchUserSlideRef.on('value', (snapshot) => {
      this.hitSlides = Object.keys(snapshot.val());
    });
  }
}
