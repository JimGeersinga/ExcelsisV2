import { Http } from '@angular/http';
import { Component, provide, ViewChild } from '@angular/core';
import { App, ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import {AuthHttp, AuthConfig} from 'angular2-jwt';

import { Utils } from './Utils';
import { PipeLines } from './Pipelines';

import { Dashboard } from './pages/dashboard/dashboard';
import { Exams } from './pages/exams/exams';
import { Assessments } from './pages/assessments/assessments';
import { Profile } from './pages/profile/profile';

@Component({
    templateUrl: 'build/app.html',
    directives: [Utils.LetterAvatar],
    pipes: [PipeLines.UniquePipe, PipeLines.FilterPipe],
    providers: [
        provide(AuthHttp, {
            useFactory: (http) => {
                return new AuthHttp(new AuthConfig, http);
            },
            deps: [Http]
        })
    ]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard.Index;
  ActivePage: string = 'Startpagina';
  pages: Array<{ title: string, component: any, icon: string, menuOrder: number }>

  constructor(private platform: Platform) {
      this.initializeApp();

      StatusBar.overlaysWebView(true); // let status bar overlay webview

      StatusBar.styleLightContent();
      
    this.pages = [
        { title: 'Startpagina', component: Dashboard.Index, icon: 'home', menuOrder: 0 },
        { title: 'Examens', component: Exams.Index, icon: 'document', menuOrder: 0 },
        { title: 'Beoordelingen', component: Assessments.Index, icon: 'paper', menuOrder: 0 },
        { title: 'Profiel', component: Profile.Index, icon: 'person', menuOrder: 1 }
    ];
  }

  initializeApp() {
    var self = this;

    this.platform.ready().then(() => {
        //this.platform.registerBackButtonAction((event) => {
        //    let view = self.nav.getActive();            
        //    if (view.instance instanceof Assessments.Index) {
                
        //    } else {
        //        self.nav.pop();
        //    }
        //}, 100);
    });
  }

  openPage(page) {
    this.ActivePage = page.title;
    this.nav.setRoot(page.component);
  }
  openProfile() {
      this.ActivePage = 'Profiel';
      this.nav.setRoot(Profile.Index);
  }
}

ionicBootstrap(MyApp);
