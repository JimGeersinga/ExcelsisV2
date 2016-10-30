import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { Utils } from '../../Utils';

export namespace Exams {
    @Component({
        templateUrl: 'build/pages/exams/index.html',
        directives: [Utils.LetterAvatar]
    })
    export class Index {
        exams: any;

        constructor(public http: Http, private nav: NavController, navParams: NavParams) {
            this.exams = [];
            http.get('exams.json')
                .map(res => res.json())
                .subscribe(
                    data => {
                        var output = [],
                            keys = [];                        
                        for (var i = 0; i < data.length;i++){
                            var key = data[i]['Subject'];
                            if (keys.indexOf(key) === -1) {
                                keys.push(key);
                                output.push(data[i]);
                            }
                        }
                        this.exams = output;
                    },
                    err => console.log(err),
                    () => console.log('Completed')
                );               
        }
    }
}