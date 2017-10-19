import {Component} from '@angular/core';
import {MenuController, NavController, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NemProvider} from '../../providers/nem/nem.provider';
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

    wallets: SimpleWallet[];
    selectedWallet: SimpleWallet;
    common: any;


    constructor(public navCtrl: NavController, private nem: NemProvider, private wallet: WalletProvider,  private alert: AlertProvider, private loading: LoadingController, private menu: MenuController, public translate: TranslateService) {

        this.wallets = [];
        this.selectedWallet = null;

        // Object to contain our password & private key data.
        this.common = {
            'password': '',
            'privateKey': ''
        };

        this.wallet.getWallets().then(value => {
            this.wallets = value;

            //select first loaded wallet by default
            if(this.wallets.length > 0) this.selectedWallet = this.wallets[0];
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
     * Enters into the app with the selected wallet
     */
    public login() {

        this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
            let loader = this.loading.create({
                content: res
            });

            loader.present().then(_ => {
                if (!this.selectedWallet) {
                    loader.dismiss();
                    this.alert.showWalletNotSelectedAlert();
                }

                // Decrypt/generate private key and check it. Returned private key is contained into this.common
                try {
                    this.common.privateKey = this.nem.passwordToPrivateKey(this.common.password, this.selectedWallet);
                    this.wallet.setSelectedWallet(this.selectedWallet);
                    loader.dismiss();
                    this.navCtrl.setRoot(BalancePage);
                } catch (err) {
                    console.log(err);
                    this.common.privateKey = '';
                    loader.dismiss();
                    this.alert.showInvalidPasswordAlert();
                }
            });
        });
    }

    /**
     * Moves to Signup Page
     */
    public goToSignup() {
        this.navCtrl.push(SignupPage);
    }

}
