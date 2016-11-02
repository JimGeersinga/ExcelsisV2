import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Modal, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from '../../Utils';
import { PipeLines } from '../../Pipelines';

export namespace Assessments {

    @Component({
        templateUrl: 'build/pages/assessments/index.html',
        directives: [Utils.LetterAvatar],
        pipes: [PipeLines.UniquePipe]
    })
    export class Index {
        assessment: any;
        Categories: any;
        

        constructor(public http: Http, private nav: NavController, navParams: NavParams) {
            var exam_subject = navParams.get('subject');
            var exam_cohort = navParams.get('cohort');
            var exam_name = navParams.get('name');

            http.get('exams.json')
                .map(res => res.json())
                .subscribe(data => {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].Subject === exam_subject && data[i].Cohort === exam_cohort && data[i].Name === exam_name) {
                            this.assessment = data[i];
                            this.Categories = data[i].Categories;
                        }
                    }
                },
                err => console.log(err),
                () => console.log('Completed')
            );
        }
    }
}