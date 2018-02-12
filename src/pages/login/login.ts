import {
  Component,
} from '@angular/core';

import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPageComponent {

  constructor(private router: Router) {

  }

  onLogin(userKind: string) {
    this.router.navigate(['mainMenu', userKind]);
  }
}
