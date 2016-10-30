import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Utils } from '../../Utils';

export namespace Dashboard {

    @Component({
        templateUrl: 'build/pages/dashboard/index.html'
    })

    export class Index {

        constructor(private navController: NavController) {
          
        }
    }
}