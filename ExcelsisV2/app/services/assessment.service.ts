import {Injectable} from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable()
export class AssessmentService {
    private _db;
    private _assessments;

    constructor() {       
    }

    public initDB() {
        this._db = new PouchDB('Assessment', { adapter: 'websql', auto_compaction: true });
    }

    public get(id) {
        return this._db.get(id);
    }

    public getAll() {
        if (!this._assessments) {
            return this._db.allDocs({ include_docs: true })
                .then(docs => {
                    this._assessments = docs.rows.map(row => {
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });

                    this._db.changes({ live: true, since: 'now', include_docs: true })
                        .on('change', this.onDatabaseChange);

                    return this._assessments;
                });
        } else {
            return Promise.resolve(this._assessments);
        }
    }

    public add(assessment) {
        return this._db.post(assessment);
    }

    public update(assessment) {
        return this._db.put(assessment);
    }

    public delete(assessment) {
        return Promise.resolve(this._db.remove(assessment));
    }

    private onDatabaseChange = (change) => {
        var index = this.findIndex(this._assessments, change.id);
        var assessment = this._assessments[index];

        if (change.deleted) {
            if (assessment) {
                this._assessments.splice(index, 1); // delete
            }
        } else {
            change.doc.Date = new Date(change.doc.Date);
            if (assessment && assessment._id === change.id) {
                this._assessments[index] = change.doc; // update
            } else {
                this._assessments.splice(index, 0, change.doc) // insert
            }
        }
    }
    
    private findIndex(array, id) {
        var low = 0, high = array.length, mid;
        while (low < high) {
            mid = (low + high) >>> 1;
            array[mid]._id < id ? low = mid + 1 : high = mid
        }
        return low;
    }
}