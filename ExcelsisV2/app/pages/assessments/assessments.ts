import { Component, NgZone } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Modal, NavController, MenuController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Utils } from '../../Utils';
import { PipeLines } from '../../Pipelines';
import { AssessmentService } from '../../services/assessment.service';

export namespace Assessments {

    @Component({
        templateUrl: 'build/pages/assessments/index.html',
        directives: [Utils.LetterAvatar],
        pipes: [PipeLines.UniquePipe]
    })
    export class Index {
        public assessment;
        public exam;
        public item: any = null;
        public confirmedExit: boolean = false;

        constructor(private assessmentService: AssessmentService,
            private http: Http,
            private menu: MenuController,
            private nav: NavController,
            private navParams: NavParams,
            private platform: Platform,
            private zone: NgZone) {  

            this.assessmentService.initDB();
        }

        public ionViewLoaded() {
            this.exam = this.navParams.get('exam');
            this.assessment = this.navParams.get('assessment');

            if (!this.assessment) {
                this.assessment = this.exam;
                for (var ii = 0; ii < this.assessment.Categories.length; ii++) {
                    for (var iii = 0; iii < this.assessment.Categories[ii].Criteria.length; iii++) {
                        this.assessment.TotalFail = this.assessment.TotalFail || 0;
                        this.assessment.TotalPass = this.assessment.TotalPass || 0;
                        this.assessment.TotalExcellent = this.assessment.TotalExcellent || 0;
                        this.assessment.Fail = this.assessment.Fail || 0;
                        this.assessment.Pass = this.assessment.Pass || 0;
                        this.assessment.Excellent = this.assessment.Excellent || 0;

                        this.assessment.TotalFail += (this.assessment.Categories[ii].Criteria[iii].Weight === 'fail') ? 1 : 0;
                        this.assessment.TotalPass += (this.assessment.Categories[ii].Criteria[iii].Weight === 'pass') ? 1 : 0;
                        this.assessment.TotalExcellent += (this.assessment.Categories[ii].Criteria[iii].Weight === 'excellent') ? 1 : 0;
                    }
                }
            }
        }       

        public ionViewDidEnter() {
            this.menu.swipeEnable(false, 'mainMenu');
        }

        public ionViewCanLeave(): boolean {
            // here we can either return true or false
            // depending on if we want to leave this view
            if (!this.confirmedExit) {
                return true;
            } else {
                return false;
            }
        }

        public endAssessment() {
            if (this.assessment._id && this.assessment._rev) {
                this.assessment.Date = new Date();
                this.assessmentService.update(this.assessment);
            } else {
                this.assessmentService.add(this.assessment);
            }

            this.confirmedExit = true;
            this.nav.pop().catch(() => console.log('should I stay or should I go now'));
        }

        public toggleItem(criterion) {
            this.item = this.isItemShown(criterion) ? null : criterion;
        };

        public isItemShown(criterion) {
            return this.item === criterion;
        };

        public isNotItemResult(criterion, value) {
            var result = criterion.Result || 'default';
            return (result !== value);            
        };

        public isItemResultSet(criterion) {
            var result = criterion.Result || 'default';
            return (result === 'yes' || result === 'no'); 
        }

        public setItemResult(criterion, value) {
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

        public openDocumentation() {
            let modal = Modal.create(Documentation);
            this.nav.present(modal);
        }
        public openExtraInfo() {
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

        public dismiss() {
            this.viewCtrl.dismiss();
        }
    }

    @Component({
        templateUrl: 'build/pages/assessments/extrainfo.html'
    })
    export class ExtraInfo {
        constructor(public viewCtrl: ViewController) {
        }

        public dismiss() {
            this.viewCtrl.dismiss();
        }
    }


    @Component({
        templateUrl: 'build/pages/assessments/list.html',
        directives: [Utils.LetterAvatar]
    })
    export class List {
        public assessments = [];

        constructor(private assessmentService: AssessmentService,
            private nav: NavController,
            private platform: Platform,
            private zone: NgZone) {

        }

        ionViewLoaded() {
            this.platform.ready().then(() => {
                this.assessmentService.initDB();

                this.assessmentService.getAll()
                    .then(data => {
                        this.zone.run(() => {
                            this.assessments = data;
                        });
                    })
                    .catch(console.error.bind(console));
            });
        }

        openAssessment(assessment) {
            this.nav.push(Assessments.Index, {assessment: assessment});
        }
    }
}