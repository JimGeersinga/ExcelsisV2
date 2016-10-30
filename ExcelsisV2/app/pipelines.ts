import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

export namespace PipeLines {
    @Pipe({
        name: 'unique'
    })
    export class UniquePipe implements PipeTransform {
        transform(items: any[], value: string): any[] {
            if (typeof value === 'undefined') {
                return items;
            }

            if ((value || _.isUndefined(value)) && _.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (_.isObject(item) && _.isString(value)) {
                        return item[value];
                    } else {
                        return item;
                    }
                };

                _.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (_.isEqual(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
        };        
    }

    @Pipe({
        name: 'filter'
    })
    export class FilterPipe {
        transform(value, filters) {
            if (_.isUndefined(value) || _.isUndefined(filters)) {
                return;
            }

            var filter = function (obj, filters) {
                return Object.keys(filters).every(prop => obj[prop] === filters[prop])
            }

            return value.filter(obj => filter(obj, filters));
        }
    }
}