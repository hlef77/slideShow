import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  ActivatedRoute,
  ParamMap
} from '@angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './mainMenu.html',
  styleUrls: ['./mainMenu.css']
})
export class MainMenuPageComponent implements OnInit {

  userKind: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap
    .subscribe((params: ParamMap) => {
      this.userKind = params.get('userKind');
    });
  }
}
