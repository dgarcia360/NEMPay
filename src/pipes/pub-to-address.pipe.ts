import { Pipe, PipeTransform } from '@angular/core';
import { NemProvider } from '../providers/nem/nem.provider';

/*
 * Transform Public to address
 * Usage:
 *   public | pubToAdress
 * Example:
 *   {{ public |  pubToAdress}}
 *   formats to: FE10DEC2...
*/



@Pipe({name: 'pubToAddress'})
export class PubToAddressPipe implements PipeTransform {
   constructor(public nem: NemProvider) {}
  transform(value: any): string {
      return this.nem.formatAddress(this.nem.pubToAddress(value));
    }
}



