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
   nem : any;
   constructor(nemProvider: NemProvider) {
          this.nem = nemProvider;
    }
  transform(value: any): string {
      return this.nem.formatAddress(this.nem.pubToAddress(value));
    }
}



