import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import {TranslateService } from '@ngx-translate/core';
import {ContactProvider} from '../providers/contact/contact.provider';
import {AlertProvider} from '../providers/alert/alert.provider';

import {AccountPage} from '../pages/account/account';
import {TransactionsPage} from '../pages/transactions/transactions';
import {BalancePage} from '../pages/balance/balance';
import {LoginPage} from '../pages/login/login';
import {ContactListPage} from '../pages/contact/list/list';

import {Network} from '@ionic-native/network';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) navCtrl: Nav;
    rootPage: any = LoginPage;
    contact: ContactProvider;
    platform: Platform;
    _alert: AlertProvider;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, network: Network, alert: AlertProvider, private translateService: TranslateService, private globalization: Globalization,  contact: ContactProvider, sqlite: SQLite) {
        platform.ready().then(() => {
            this.contact = contact;
            this.platform = platform;
            this._alert = alert;


            let availableLanguages = ['en', 'es','ca', 'ko', 'ru', 'pl', 'ja', 'de'];

            network.onDisconnect().subscribe(() => {
                this._alert.showOnPhoneDisconnected();
            });

            //i18n configuration
            this.translateService.setDefaultLang('en');
            if (platform.is('cordova')) {
                this.globalization.getPreferredLanguage()
                    .then(language => {
                        //if the file is available
                        if (language.value in availableLanguages) {
                            this.translateService.use(language.value);
                        }
                        //else, try with the first substring
                        else{
                            for (var lang of availableLanguages){
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
                this.translateService.use('en');
            }
            
            if (platform.is('cordova')){

                console.log("IM CALLED");

                sqlite.create({
                      name: 'data.db',
                      location: 'default'
                }).then((db: SQLiteObject) => {
                    this.contact.setDatabase(db);
                    this.contact.createTable().then(_=>{
                        splashScreen.hide();
                    });
               
                }).catch(error =>{
                      console.error(error);
                });
            }
            else splashScreen.hide();

            //ionic default
            statusBar.styleDefault();
        });
    }

    goToBalance(params) {
        if (!params) params = {};
        this.navCtrl.setRoot(BalancePage);
    }

    goToAccount(params) {
        if (!params) params = {};
        this.navCtrl.setRoot(AccountPage);
    }

    goToTransactions(params) {
        if (!params) params = {};
        this.navCtrl.setRoot(TransactionsPage);
    }

    goToContactList(params) {
        if (!params) params = {};
        if (this.platform.is('cordova')) this.navCtrl.setRoot(ContactListPage);

        else {
            this._alert.showFunctionallityOnlyAvailableInMobileDevices();
        }
    }

}
