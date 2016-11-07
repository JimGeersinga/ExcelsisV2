import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Modal, NavController, MenuController,  NavParams, ViewController } from 'ionic-angular';
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
        confirmedExit: boolean = false;

        constructor(public http: Http, private menu: MenuController, private nav: NavController, navParams: NavParams) {
            var exam_subject = navParams.get('subject');
            var exam_cohort = navParams.get('cohort');
            var exam_name = navParams.get('name');
            http.get('exams.json')
                .map(res => res.json())
                .subscribe(data => {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].Subject === exam_subject && data[i].Cohort === exam_cohort && data[i].Name === exam_name) {
                           
                            for (var ii = 0; ii < data[i].Categories.length; ii++) {
                                for (var iii = 0; iii < data[i].Categories[ii].Criteria.length; iii++) {  
                                    data[i].TotalFail = data[i].TotalFail || 0;
                                    data[i].TotalPass = data[i].TotalPass || 0;
                                    data[i].TotalExcellent = data[i].TotalExcellent || 0;
                                    data[i].Fail = data[i].Fail || 0;
                                    data[i].Pass = data[i].Pass || 0;
                                    data[i].Excellent = data[i].Excellent || 0;

                                    data[i].TotalFail += (data[i].Categories[ii].Criteria[iii].Weight === 'fail') ? 1 : 0;
                                    data[i].TotalPass += (data[i].Categories[ii].Criteria[iii].Weight === 'pass') ? 1 : 0;
                                    data[i].TotalExcellent += (data[i].Categories[ii].Criteria[iii].Weight === 'excellent') ? 1 : 0;
                                }
                            }
                            this.assessment = data[i];
                        }
                    }
                },
                err => console.log(err),
                () => console.log('Completed')
            );
        }

        endAssessment() {
            this.confirmedExit = true;
            this.nav.pop().catch(() => console.log('should I stay or should I go now'));
        }

        ionViewDidEnter() {
            this.menu.swipeEnable(false, 'mainMenu');
        }

        ionViewCanLeave(): boolean {
            // here we can either return true or false
            // depending on if we want to leave this view
            if (!this.confirmedExit) {
                return true;
            } else {
                return false;
            }
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

        openDocumentation() {
            let modal = Modal.create(Documentation);
            this.nav.present(modal);
        }
        openExtraInfo() {
            let modal = Modal.create(ExtraInfo);
            this.nav.present(modal);
        }
    }

    @Component({
        templateUrl: 'build/pages/assessments/documentation.html'
    })
    export class Documentation {       
        constructor(public viewCtrl: ViewController) {
        }

        dismiss() {
            this.viewCtrl.dismiss();
        }
    }

    @Component({
        templateUrl: 'build/pages/assessments/extrainfo.html'
    })
    export class ExtraInfo {
        constructor(public viewCtrl: ViewController) {
        }

        dismiss() {
            this.viewCtrl.dismiss();
        }
    }
}