import {Pipe, PipeTransform} from '@angular/core';
import {NemProvider} from '../providers/nem/nem.provider';
import {ConfigProvider} from '../providers/config/config.provider';

/*
 * Transform Public to address
 * Usage:
 *   public | pubToAdress
 * Example:
 *   {{ public |  pubToAdress}}
 *   formats to: TE10DEC2...
 */
 
@Pipe({name: 'pubToAddress'})
export class PubToAddressPipe implements PipeTransform {
    constructor(public nem: NemProvider, private config: ConfigProvider) {
    }

    transform(value: any): string {
        return this.nem.formatAddress(this.nem.pubToAddress(value, this.config.defaultNetwork()));
    }
}