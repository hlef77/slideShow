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
  UploadDialogComponent
} from '../../components/dialog/uploadDialog/uploadDialog';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './mainMenu.html',
  styleUrls: ['./mainMenu.css']
})
export class MainMenuPageComponent implements OnInit {

  userKind: string;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadList();
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.userKind = params.get('userKind');
      });
  }

  loadList = () => {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  openUploadDialog = () => {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadList();
      }
    });
  }
}
