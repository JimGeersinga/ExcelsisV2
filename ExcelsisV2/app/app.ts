import { Component, ViewChild } from '@angular/core';
import { App, ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Utils } from './Utils';

import { Dashboard } from './pages/dashboard/dashboard';
import { Exams } from './pages/exams/exams';
import { Assessments } from './pages/assessments/assessments';

@Component({
    templateUrl: 'build/app.html',
    directives: [Utils.LetterAvatar]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard.Index;
  ActivePage: string = 'Startpagina';
  pages: Array<{title: string, component: any, icon: string}>

  constructor(private platform: Platform) {
    this.initializeApp();
      
    this.pages = [
        { title: 'Startpagina', component: Dashboard.Index, icon: 'home'},
        { title: 'Examens', component: Exams.Index, icon: 'document' },
        { title: 'Beoordelingen', component: Assessments.Index, icon: 'paper' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
        StatusBar.styleBlackTranslucent();
    });
  }

  openPage(page) {
    this.ActivePage = page.title;
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);
