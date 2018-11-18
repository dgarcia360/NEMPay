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
import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {AppVersion} from '@ionic-native/app-version';
import {ContactProvider} from '../providers/contact/contact.provider';
import {AlertProvider} from '../providers/alert/alert.provider';
import {LanguageProvider} from '../providers/language/language.provider';
import {AccountPage} from '../pages/account/account';
import {TransactionsPage} from '../pages/transactions/transactions';
import {BalancePage} from '../pages/balance/balance';
import {LoginPage} from '../pages/login/login';
import {ContactListPage} from '../pages/contact/list/list';
import {Network} from '@ionic-native/network';
import {NEMLibrary, NetworkTypes} from "nem-library";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) navCtrl: Nav;
    rootPage: any = LoginPage;
    version: string = "";

    constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
                private network: Network, private alert: AlertProvider,  private contact: ContactProvider,
                private language: LanguageProvider, private sqlite: SQLite, private appVersion: AppVersion) {

        NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

        platform.ready().then(() => {

            this.language.setLanguage();
            this.checkNetwork();
            this.setVersion();
            this.setDatabase();
            statusBar.styleDefault();
        });
    }

    goToBalance(params: Object) {
        if (!params) params = {};
        this.navCtrl.setRoot(BalancePage);
    }

    goToAccount(params: Object) {
        if (!params) params = {};
        this.navCtrl.setRoot(AccountPage);
    }

    goToTransactions(params: Object) {
        if (!params) params = {};
        this.navCtrl.setRoot(TransactionsPage);
    }

    goToContactList(params: Object) {
        if (!params) params = {};
        if (this.platform.is('cordova')) {
            this.navCtrl.setRoot(ContactListPage);
        } else {
            this.alert.showFunctionalityOnlyAvailableInMobileDevices();
        }
    }

    private setDatabase(){
        if (this.platform.is('cordova')){

            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                console.log('INFO: Database created');
                this.contact.setDatabase(db);
                this.contact.createTable().then(ignored =>{
                    this.splashScreen.hide();
                });
            }).catch(error =>{
                console.error(error);
            });
        } else {
            this.splashScreen.hide();
        }
    }

    private setVersion(){
        if (this.platform.is('cordova')) {
            this.appVersion.getVersionNumber().then((v) => {
                this.version = "V. "+v;
            });
        } else {
            this.version = "Web Version";
        }
    }

    private checkNetwork(){
        this.network
            .onDisconnect()
            .subscribe(() => this.alert.showOnPhoneDisconnected(),
                err => console.log(err));
    }
}
