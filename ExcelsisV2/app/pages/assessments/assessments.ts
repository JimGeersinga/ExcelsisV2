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
        item: any = null;
        

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
                        }
                    }
                },
                err => console.log(err),
                () => console.log('Completed')
            );
        }
        toggleItem(criterion) {
            this.item = this.isItemShown(criterion) ? null : criterion;
        };

        isItemShown(criterion) {
            return this.item === criterion;
        };

        isNotItemResult(criterion, value) {
            var result = criterion.Result || 'default';
            return (result !== value);            
        };

        isItemResultSet(criterion) {
            var result = criterion.Result || 'default';
            return (result === 'yes' || result === 'no'); 
        }

        setItemResult(criterion, value) {
            if (criterion.Weight === 'excellent') {
                if (criterion.Result !== value && value === 'yes') {
                    this.assessment.Excellent++;
                } else if (criterion.Result === 'yes' && (value === 'no' || value === 'yes')) {
                    this.assessment.Excellent--;
                }
            } else if (criterion.Weight === 'pass') {
                if (criterion.Result !== value && value === 'yes') {
                    this.assessment.Pass++;
                } else if (criterion.Result === 'yes' && (value === 'no' || value === 'yes')) {
                    this.assessment.Pass--;
                }
            } else if (criterion.Weight === 'fail') {
                if (criterion.Result !== value && value === 'yes') {
                    this.assessment.Fail++;
                } else if (criterion.Result === 'yes' && (value === 'no' || value === 'yes')) {
                    this.assessment.Fail--;
                }
            }
            criterion.Result = (criterion.Result === value) ? 'default' : value;
        };
    }
}