import { Pipe, PipeTransform } from '@angular/core';
import { NemProvider } from '../providers/nem/nem.provider';


@Pipe({name: 'formatAddress'})
export class FormatAddressPipe implements PipeTransform {
   constructor(public nem: NemProvider) {}
  transform(value: any): string {
      return this.nem.formatAddress(value);
    }
}