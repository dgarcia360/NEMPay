import {Pipe, PipeTransform} from '@angular/core';
import {NemProvider} from '../providers/nem/nem.provider';

/*
 * Formats NEM Address
 * Takes an unformatted address and formats it.
 * Usage:
 *   "TBMVIOVCN3ZQJDSLR2MPOH3LEVPIPULZPUQVBOVE" | formatAddress
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: TBMVIO-VCN3ZQ-JDSLR2-MPOH3-LEVPI-PULZPU-QVBOVE
 */
@Pipe({name: 'formatAddress'})
export class FormatAddressPipe implements PipeTransform {
    constructor(public nem: NemProvider) {
    }

    transform(value: any): string {
        return this.nem.formatAddress(value);
    }
}