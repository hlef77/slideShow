import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFireDatabase
} from 'angularfire2/database';

import {
  SLIDE_CONTENTS
} from '../slideContents/slideContents';
import {
  FirebaseApp
} from 'angularfire2/firebase.app.module';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string;

  count = 0;

  titleRef;
  contentsRef;
  countRef;

  host = false;

  slideContents = SLIDE_CONTENTS;
  currentPageItems = [];

  constructor(db: AngularFireDatabase) {
    this.titleRef = db.database.ref('/title');
    this.countRef = db.database.ref('/count');
    this.contentsRef = db.database.ref('/content');

    this.titleRef.set('');
    this.countRef.set(0);
    this.contentsRef.set('');
  }

  ngOnInit() {
    this.titleRef.on('value', (snapshot) => {
      document.getElementById('title').innerText = snapshot.val();
    });

    this.contentsRef.on('value', (snapshot) => {
      if (snapshot.val() === '') {
        this.clearContents();
      }
      if (snapshot.val()[this.count] !== null && snapshot.val()[this.count] !== undefined) {
        document.getElementById('slide-contents').innerHTML += '<div class="contents-text">' + snapshot.val()[this.count] + '</div>';
      }
    });

    this.countRef.on('value', (snapshot) => {
      this.count = snapshot.val();
    });

    this.titleRef.set('Hello!');
  }

  next = async () => {
    if (this.host === false) {
      return;
    }
    if (this.currentPageItems.length === 0 && this.slideContents.length !== 0) {
      await this.getNextSlide();
    }
    if (this.currentPageItems[0] !== null && this.currentPageItems[0] !== undefined) {
      const addkinds = Object.keys(this.currentPageItems[0]);
      addkinds.forEach(addkind => {
        switch (addkind) {
          case 'text':
          this.contentsRef.update({
              [this.count]: this.currentPageItems.shift().text
            });
            break;
          default:
            break;
        }
        this.countRef.set(this.count + 1);
      });
    }
  }

  async getNextSlide() {
    await this.contentsRef.set('');
    this.currentPageItems = this.slideContents.shift();
  }

  reset = () => {
    if (this.host === true) {
      this.contentsRef.set('');
      this.slideContents = SLIDE_CONTENTS;
    }
  }

  clearContents = async () => {
    document.getElementById('slide-contents').innerHTML = '';
    await this.countRef.set(0);
  }

  changeFullScreen = () => {
    const elem = document.getElementById('slide-display');
    console.log(elem);
    if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    }
  }

  onLock = () => {
    this.host = true;
  }

  onUnLock = () => {
    this.host = false;
  }
}
