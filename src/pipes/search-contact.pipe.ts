/*
 * MIT License
 *
 * Copyright (c) 2017 David Garcia <dgarcia360@outlook.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {Pipe, PipeTransform} from '@angular/core';
import {ContactProvider} from '../providers/contact/contact.provider';
import {Platform} from 'ionic-angular';

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
			}).catch(err => console.log(err));
		} else{
    		return Promise.resolve(value);
		}
    }
}