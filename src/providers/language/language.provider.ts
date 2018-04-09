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
    constructor(private translateService: TranslateService, private platform: Platform, private globalization: Globalization) {
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
               })
               .catch(e => console.log(e));
       }
       else{
           this.translateService.use(this.defaultLanguage);
       }
   }
}