import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

export namespace Assessments {

    @Component({
        templateUrl: 'build/pages/assessments/index.html'
    })

    export class Index {

        constructor(private navController: NavController) {
        }
    }
}