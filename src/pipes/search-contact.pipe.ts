import {Pipe, PipeTransform} from '@angular/core';
import {ContactProvider} from '../providers/contact/contact.provider';
import {Platform} from 'ionic-angular';

/*
 * Replace's Address by Contact Name from Database
 * Takes the owner as a parameter
 * Usage:
 *   value | searchContact:owner
 * Example:
 *   {{ 2 |  searchContact:owner}}
 *   formats to: name
 */

@Pipe({name: 'searchContact'})
export class SearchContactPipe implements PipeTransform {
    constructor(public contact: ContactProvider, private platform: Platform) {
    
    }

    transform(value: string, owner: string): any {
    	if(this.platform.is('cordova')){

			return this.contact.searchContactName(owner, value).then(contacts =>{
				if(contacts.length > 0){
					return contacts[0].name;
				}
				else return value;
			});
		}
		else{
    		return Promise.resolve(value);
		}
    }
}