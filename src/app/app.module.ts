import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule,
  Component
} from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatListModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatIconModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  AppComponent
} from './app.component';

import {
  AngularFireModule
} from 'angularfire2';
import {
  AngularFireDatabaseModule
} from 'angularfire2/database';
import {
  AngularFireAuthModule
} from 'angularfire2/auth';
import {
  environment
} from '../environments/environment';

import {
  LoginPageComponent
} from '../pages/login/login';
import {
  MainMenuPageComponent
} from '../pages/mainMenu/mainMenu';
import {
  SlidePageComponent
} from '../pages/slide/slide';

import {
  AlertDialogComponent
} from '../components/dialog/alertDialog/alertDialog';
import {
  LoadingDialogComponent
} from '../components/dialog/loadingDialog/loadingDialog';
import {
  UploadDialogComponent
} from '../components/dialog/uploadDialog/uploadDialog';

import {
  UserInfo
} from '../models/userInfo/userInfo';
import {
  DownloadSlide
} from '../models/downloadSlide/downloadSlide';

const appRoutes: Routes = [{
  path: 'login',
  component: LoginPageComponent
}, {
  path: 'mainMenu/:userKind',
  component: MainMenuPageComponent
}, {
  path: 'slide',
  component: SlidePageComponent
}, {
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
}, ];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainMenuPageComponent,
    SlidePageComponent,
    AlertDialogComponent,
    LoadingDialogComponent,
    UploadDialogComponent
  ],
  entryComponents: [
    AlertDialogComponent,
    LoadingDialogComponent,
    UploadDialogComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(
      appRoutes, {
        enableTracing: true
      }
    )
  ],
  providers: [
    DownloadSlide,
    UserInfo
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
