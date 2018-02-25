import {
  Component,
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  UserInfo
} from '../../models/userInfo/userInfo';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPageComponent {

  userId: string;
  password: string;
  userName: string;

  constructor(
    private router: Router,
    private userInfo: UserInfo
  ) {
    this.userId = '';
  }

  onLogin(userKind: string) {
    if (userKind === 'HOST') {
      this.userInfo.userId = this.userId;
      // 本来はDBからIDで名前取ってくる
      this.userInfo.userName = this.userId;
    } else {
      this.userInfo.userName = this.userName;
      this.userInfo.userId = '';
    }
    this.router.navigate(['mainMenu', userKind]);
  }
}
