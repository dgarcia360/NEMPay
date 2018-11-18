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
import {Injectable} from '@angular/core';
import {TranslateService } from '@ngx-translate/core';
import {Platform} from 'ionic-angular';
import { Globalization } from '@ionic-native/globalization';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the Alert provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class LanguageProvider {
    availableLanguages: string[];
    defaultLanguage: string;
    constructor(private translateService: TranslateService, private platform: Platform,
                private globalization: Globalization) {
        this.availableLanguages = ['en', 'es','ca', 'ko', 'ru', 'pl', 'ja', 'de','cmn-Hans-CN'];
        this.defaultLanguage = 'en';
    }

   setLanguage(){
       //i18n configuration
       this.translateService.setDefaultLang('en');
       if (this.platform.is('cordova')) {
           this.globalization.getPreferredLanguage()
               .then(language => {
                   //if the file is available
                   if (language.value in this.availableLanguages) {
                       this.translateService.use(language.value);
                   }
                   //else, try with the first substring
                   else{
                       for (var lang of this.availableLanguages){
                           if(language.value.split("-")[0] == lang){
                               this.translateService.use(lang);
                               break;
                           }
                       }
                   }
               }).catch(e => console.log(e));
       } else {
           this.translateService.use(this.defaultLanguage);
       }
   }
}