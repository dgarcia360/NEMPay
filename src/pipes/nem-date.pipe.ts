import { Pipe, PipeTransform } from '@angular/core';
import { NemProvider } from '../providers/nem/nem.provider';

/*
 * Transforms nemDate into readable date
 * Usage:
 *   date_in-nem_format | nemDate
 * Example:
 *   {{ date_in-nem_format |  nemDate}}
 *   formats to: 12/24/2017
*/



@Pipe({name: 'nemDate'})
export class NemDatePipe implements PipeTransform {
   nem : any;
   constructor(nemProvider: NemProvider) {
          this.nem = nemProvider;
    }
  transform(value: any): string {
      return this.nem.nemDate(value);
    }
}



