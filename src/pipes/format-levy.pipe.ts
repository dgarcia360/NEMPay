import {Pipe, PipeTransform} from '@angular/core';
import {NemProvider} from '../providers/nem/nem.provider';

@Pipe({name: 'formatLevy'})
export class FormatLevyPipe implements PipeTransform {
    constructor(public nem: NemProvider) {
    }

    transform(value): any {
        return this.nem.formatLevy(value);
    }
}