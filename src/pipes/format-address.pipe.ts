import { Pipe, PipeTransform } from '@angular/core';
import { NemProvider } from '../providers/nem/nem.provider';


@Pipe({name: 'formatAddress'})
export class FormatAddressPipe implements PipeTransform {
   nem : any;
   constructor(nemProvider: NemProvider) {
          this.nem = nemProvider;
    }
  transform(value: any): string {
      return this.nem.formatAddress(value);
    }
}



