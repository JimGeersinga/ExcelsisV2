import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Modal, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from '../../Utils';

export namespace Exams {
    @Component({
        templateUrl: 'build/pages/exams/index.html',
        directives: [Utils.LetterAvatar]
    })
    export class Index {
        exams: any;
        result: any;

        constructor(public http: Http, private nav: NavController, navParams: NavParams) {
            this.exams = [];
            http.get('exams.json')
                .map(res => res.json())
                .subscribe(data => {
                    var output = [],
                        keys = [];   
                    this.result = data;                     
                    for (var i = 0; i < data.length;i++){
                        var key = data[i]['Subject'];
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(data[i]);
                        }

                        if (keys.indexOf(key) === -1) {
                            this.result.push(key);
                            this.result[key] = data[i];
                        } else {
                        }
                    }
                    this.exams = output;
                },
                err => console.log(err),
                () => console.log('Completed')
            );               
        }

        openModal(exam) {
            
            let modal = Modal.create(Detail, {exam : exam.Subject});
            this.nav.present(modal);
        }
    }

    @Component({
        templateUrl: 'build/pages/exams/detail.html',
        directives: [Utils.LetterAvatar]
    })
    export class Detail {
        exams: any;
        Subject: string;
        Abbreviation: string;
        Crebo: string;

        constructor(public http: Http, private nav: NavController, navParams: NavParams, public viewCtrl: ViewController) {
            this.exams = [];
            var exam = navParams.get('exam');
            http.get('exams.json')
                .map(res => res.json())
                .subscribe(data => {
                    var output = [];
                    for (var i = 0; i < data.length; i++) {  
                        if (data[i].Subject === exam) { 
                            output.push(data[i]);
                        }
                    }
                    this.exams = output;
                    this.Subject = output[0].Subject;
                    this.Abbreviation = output[0].Abbreviation;
                    this.Crebo = output[0].Crebo;
                },
                err => console.log(err),
                () => console.log('Completed')
            );
        }
        dismiss() {
            this.viewCtrl.dismiss();
        }
    }
}