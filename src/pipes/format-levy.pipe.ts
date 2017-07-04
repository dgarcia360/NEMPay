import {Pipe, PipeTransform} from '@angular/core';
import {NemProvider} from '../providers/nem/nem.provider';
import {ConfigProvider} from '../providers/config/config.provider';


@Pipe({name: 'formatLevy'})
export class FormatLevyPipe implements PipeTransform {
    constructor(public nem: NemProvider, private  config: ConfigProvider) {
    }

    transform(mosaic: any, levy: any): any {
        return this.nem.formatLevy(mosaic, 1, levy, this.config.defaultNetwork());
    }
}