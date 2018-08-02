import {Pipe, PipeTransform} from '@angular/core';
import {NemProvider} from '../providers/nem/nem.provider';

import {XEM} from 'nem-library';

@Pipe({name: 'formatXEM'})
export class FormatXEMPipe implements PipeTransform {
    constructor(public nem: NemProvider) {
    }

    transform(xem: number): any {
        return xem / Math.pow(10, XEM.DIVISIBILITY);
    }
}