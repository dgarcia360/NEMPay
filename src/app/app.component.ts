import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, AlertController} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';

import { TranslateService } from '@ngx-translate/core';

import {AccountPage} from '../pages/account/account';
import {TransactionsPage} from '../pages/transactions/transactions';
import {BalancePage} from '../pages/balance/balance';
import {LoginPage} from '../pages/login/login';
import {Network} from '@ionic-native/network';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) navCtrl: Nav;
    rootPage: any = LoginPage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, network: Network, alertCtrl: AlertController, private translateService: TranslateService, private globalization: Globalization) {
        platform.ready().then(() => {

            // alert if internet is disconnected
            let alert = alertCtrl.create({
                title: 'Your phone is disconnected from internet',
                subTitle: 'Open the app again once you have internet connection',
            });

            let availableLanguages = ['en', 'es','ca', 'ko', 'ru', 'pl', 'ja', 'de'];

            network.onDisconnect().subscribe(() => {
                alert.present();
            });

            //i18n configuration
            this.translateService.setDefaultLang('ja');
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

            //ionic default
            statusBar.styleDefault();
            splashScreen.hide();
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
}
