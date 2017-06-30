import {Pipe, PipeTransform} from '@angular/core';
import {NemProvider} from '../providers/nem/nem.provider';

/*
 * Transforms message Payload to readable message
 * Usage:
 *   message.payload | message
 * Example:
 *   {{ message.payload |  message}}
 *   formats to: Hello World!
 */


@Pipe({name: 'hexMessageToString'})
export class HexMessageToStringPipe implements PipeTransform {
    constructor(public nem: NemProvider) {
    }

    transform(value: any): string {
        return this.nem.hexMessage(value);
    }
}


