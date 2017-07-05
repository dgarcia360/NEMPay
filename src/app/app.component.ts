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
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            let alert = alertCtrl.create({
                title: 'Your phone is disconnected from internet',
                subTitle: 'Open the app again once you have internet connection',
            });

            network.onDisconnect().subscribe(() => {
                alert.present();
            });

            this.translateService.setDefaultLang('en');
            if (platform.is('cordova')) {

                this.globalization.getPreferredLanguage()
                    .then(language => {

                        if (language.value == 'es') {
                            this.translateService.use('es');
                        }
                        else if (language.value == 'ca') {
                            this.translateService.use('ca');
                        }
                        else {
                            this.translateService.use('en');
                        }

                    })
                    .catch(e => console.log(e));
            }
            else{
                this.translateService.use('en');
            }

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
