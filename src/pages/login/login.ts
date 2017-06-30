import {Component} from '@angular/core';
import {MenuController, NavController, LoadingController} from 'ionic-angular';

import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';

import {BalancePage} from '../balance/balance';
import {SignupPage} from '../signup/signup';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    wallets: any;
    selectedWallet: any;
    common: any;


    constructor(public navCtrl: NavController, private nem: NemProvider, private alert: AlertProvider, private loading: LoadingController, private menu: MenuController) {

        this.wallets = [];
        this.selectedWallet = null;

        // Object to contain our password & private key data.
        this.common = {
            'password': '',
            'privateKey': ''
        };

        this.nem.getWallets().then(
            value => {
                this.wallets = value;
            }
        );

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

    login() {

        let loader = this.loading.create({
            content: "Please wait..."
        });


        loader.present().then(
            _ => {

                if (!this.selectedWallet) {
                    loader.dismiss();
                    this.alert.showWalletNotSelectedAlert();
                }
                var invalidPassword = false;
                // Decrypt/generate private key and check it. Returned private key is contained into this.common
                if (!this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo)) {
                    invalidPassword = true;
                }

                if (!invalidPassword && (this.common.privateKey.length === 64 || this.common.privateKey.length === 66)) {

                    if (!this.nem.checkAddress(this.common.privateKey, this.selectedWallet.accounts[0].network, this.selectedWallet.accounts[0].address)) {
                        invalidPassword = true;
                    }
                }
                else {
                    invalidPassword = true;
                    this.common.privateKey = '';
                }

                if (invalidPassword) {
                    loader.dismiss();
                    this.alert.showInvalidPasswordAlert();
                }
                else {
                    this.nem.setSelectedWallet(this.selectedWallet);
                    loader.dismiss();
                    this.navCtrl.push(BalancePage);

                }
            })
    }

    goToSignup(params) {
        if (!params) params = {};
        this.navCtrl.push(SignupPage);
    }

}
