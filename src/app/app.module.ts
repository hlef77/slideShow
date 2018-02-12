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
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule
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

const appRoutes: Routes = [{
  path: 'login',
  component: LoginPageComponent
}, {
  path: 'mainMenu',
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
    SlidePageComponent
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
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule.forRoot(
      appRoutes, {
        enableTracing: true
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
