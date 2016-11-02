import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Modal, NavController, NavParams, ViewController } from 'ionic-angular';
import { Assessments } from '../assessments/assessments';
import { Utils } from '../../Utils';
import { PipeLines } from '../../Pipelines';


export namespace Exams {
    @Component({
        templateUrl: 'build/pages/exams/index.html',
        directives: [Utils.LetterAvatar],
        pipes: [PipeLines.UniquePipe]
    })
    export class Index {
        exams: any;

        constructor(public http: Http, private nav: NavController, navParams: NavParams) {
            this.exams = [];
            http.get('exams.json')
                .map(res => res.json())
                .subscribe(data => {                
                    this.exams = data;
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
        directives: [Utils.LetterAvatar],
        pipes: [PipeLines.UniquePipe, PipeLines.FilterPipe]
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
        openAssessment(exam) {
            this.nav.push(Assessments.Index, { subject: exam.Subject, cohort: exam.Cohort, name: exam.Name });
        }
    }
}