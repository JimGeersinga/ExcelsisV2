import { Component, NgZone } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Modal, NavController, MenuController, NavParams, ViewController, Platform, ActionSheet } from 'ionic-angular';
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

                        this.assessment.TotalCriteria = this.assessment.TotalFail + this.assessment.TotalPass + this.assessment.TotalExcellent;
                        this.assessment.CriteriaLeft = this.assessment.TotalCriteria - (this.assessment.Fail + this.assessment.Pass + this.assessment.Excellent);
                        
                    }
                }
            }
        }       

        ionViewDidEnter() {
            this.menu.swipeEnable(false, 'mainMenu');
        }

        ionViewDidLeave() {
            this.menu.swipeEnable(true, 'mainMenu');
        }

        public endAssessment() {
            if (this.assessment._id && this.assessment._rev) {
                this.assessment.Date = new Date();
                this.assessmentService.update(this.assessment);
            } else {
                this.assessmentService.add(this.assessment);
            }

            this.nav.pop().catch(() => console.log('should I stay or should I go now'));
        }

        public isExtraInfoSet(criterion) {
            return ((typeof criterion.marks != 'undefined' && criterion.marks.length > 0) || (typeof criterion.message != 'undefined' && criterion.message.length > 0));
        }

        public toggleItem(criterion) {
            this.item = this.isItemShown(criterion) ? null : criterion;
        };

        public isItemShown(criterion) {
            return this.item === criterion;
        };

        public isItemResultSet(criterion, value) {
            var result = criterion.Result || 'default';
            return (result === value);            
        };

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

            if (criterion.Result === value) {
                this.assessment.CriteriaLeft++;
            } else if (criterion.Result !== value && (criterion.Result === 'default' || typeof criterion.Result === 'undefined')) {
                this.assessment.CriteriaLeft--;
            }

            criterion.Result = (criterion.Result === value) ? 'default' : value;
        };

        public openDocumentation() {
            let modal = Modal.create(Documentation);
            this.nav.present(modal);
        }
        public openExtraInfo(criterion) {
            let modal = Modal.create(ExtraInfo, { criterion: criterion });
            modal.onDismiss(data => {
                criterion = data;
            });
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
        criterion: any;

        constructor(private navParams: NavParams,
            public viewCtrl: ViewController) {

            this.criterion = this.navParams.get('criterion');
            this.criterion.marks = this.criterion.marks || [];
        }

        IsMarkActive(value) {
            return (this.criterion.marks.indexOf(value) == -1)
        }

        setMark(value) {
            var index = this.criterion.marks.indexOf(value);
            if (index == -1) {
                this.criterion.marks.push(value);
            }
            else {
                this.criterion.marks.splice(index, 1)
            }
        }

        public dismiss() {
            this.viewCtrl.dismiss(this.criterion);
        }
    }


    @Component({
        templateUrl: 'build/pages/assessments/list.html',
        directives: [Utils.LetterAvatar]
    })
    export class List {
        public assessments = [];
        public item: any = null;

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

        public toggleItem(assessment) {
            this.item = this.isItemShown(assessment) ? null : assessment;
        };

        public isItemShown(assessment) {
            return this.item === assessment;
        };

        public openActionSheet(assessment, index) {
            let actionSheet = ActionSheet.create({
                title: 'Opties',
                buttons: [
                    {
                        text: 'Verwijderen',
                        icon: 'trash',
                        role: 'destructive',
                        handler: () => {
                            this.deleteAssessment(assessment, index);
                        }
                    }, {
                        text: 'Archieveren',
                        icon: 'archive',
                        handler: () => {
                            console.log('Archive clicked');
                        }
                    }, {
                        text: 'Samenvoegen',
                        icon: 'git-compare',
                        handler: () => {
                            console.log('Compare clicked');
                        }
                    }, {
                        text: 'Emailen',
                        icon: 'mail',
                        handler: () => {
                            console.log('Email clicked');
                        }
                    }, {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            });
            this.nav.present(actionSheet);
        }
        

        openAssessment(assessment) {
            this.nav.setRoot(Assessments.Index, { assessment: assessment });
        }

        deleteAssessment(assessment, index) {
            var self = this;
            assessment.Date = new Date();
            this.assessmentService.delete(assessment).then(function () {
                self.assessments.splice(index, 1);
            });
        };
    }
}