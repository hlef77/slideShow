import {
  Component,
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  AngularFireDatabase
} from 'angularfire2/database';

import {
  UserInfo
} from '../../models/userInfo/userInfo';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPageComponent {

  // inputのユーザーIDの値(HOST)
  userId: string;
  // inputのパスワードの値(HOST)
  password: string;
  // inputのユーザー名の値(GUEST)
  userName: string;
  // ホストログイン時にエラー等があった場合に表示する
  hostLoginMessage = '';

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    private userInfo: UserInfo
  ) {
    // this.userId = '';
  }

  onLogin(userKind: string) {
    if (userKind === 'HOST') {
      // ホストユーザーとしてログインする場合、IDとPASSのチェック
      const rootRef = this.db.database.ref(`/`);

      rootRef.once('value', (rootSnapshot) => {
        // 対象ユーザーIDが存在するか確認
        if (rootSnapshot.hasChild(`${this.userId}`)) {
          // 存在する場合
          const loginUserRef = this.db.database.ref(`/${this.userId}/`);
          loginUserRef.child('password').once('value', (passwordSnapshot) => {

            if (passwordSnapshot.val() && this.password !== passwordSnapshot.val()) {
              // パスワードが一致しない場合
              this.hostLoginMessage = 'パスワードが正しくありません';

            } else {
              // ログインOK
              this.userInfo.userId = this.userId;
              // DBから名前取ってくる
              loginUserRef.child('name').once('value', (nameSnapshot) => {
                this.userInfo.userName = nameSnapshot.val();
                // メインメニュー画面に遷移
                this.router.navigate(['mainMenu', userKind]);
              });
            }

          });

        } else {
          // 対象ユーザーIDが存在しない場合
          this.hostLoginMessage = 'ユーザーIDが存在しません';
        }
      });
    } else {
      this.userInfo.userName = this.userName;
      this.userInfo.userId = '';
      this.router.navigate(['mainMenu', userKind]);
    }
  }
}
