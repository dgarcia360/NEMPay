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
import {Component} from '@angular/core';
import {LoadingController, MenuController, NavController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {BalancePage} from '../balance/balance';
import {SignupPage} from '../signup/signup';
import {SimpleWallet} from 'nem-library';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    private wallets: SimpleWallet[];
    private selectedWallet: SimpleWallet;
    private password: string;

    constructor(public navCtrl: NavController, private wallet: WalletProvider, private alert: AlertProvider,
                private loading: LoadingController, private menu: MenuController,
                public translate: TranslateService) {

        this.wallets = [];
        this.selectedWallet = null;
        this.password = '';

        this.wallet.getWallets().then(wallets => {
            this.wallets = wallets;
            if(this.wallets.length > 0) {
                this.selectedWallet = this.wallets[0];
            }
        });

    }

    ionViewWillEnter() {
        // the left menu should be disabled on the login page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the left menu when leaving the login page
        this.menu.enable(true);
    }

    compareFn(e1: any, e2: any): boolean {
        return e1 && e2 ? e1.name === e2.name : e1 === e2;
    }

    /**
     * Login the app with the selected wallet
     */
    public login() {

        this.translate
            .get('PLEASE_WAIT', {})
            .subscribe((res: string) => {

                let loader = this.loading.create({content: res});

                loader.present().then(_ => {
                    if (!this.selectedWallet) {
                        this.alert.showWalletNotSelectedAlert();
                    } else if(this.wallet.passwordMatchesWallet(this.password, this.selectedWallet)){
                        this.wallet.setSelectedWallet(this.selectedWallet);
                        this.navCtrl.setRoot(BalancePage);
                    }
                    else{
                        this.alert.showInvalidPasswordAlert();
                    }
                    loader.dismiss();
                });
            }, err => console.log(err));
    }

    /**
     * Moves to Signup Page
     */
    public goToSignup() {
        this.navCtrl.push(SignupPage);
    }

}
