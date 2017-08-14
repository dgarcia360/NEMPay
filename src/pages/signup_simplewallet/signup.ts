import {Component} from '@angular/core';
import {App, AlertController, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {AlertProvider} from '../../providers/alert/alert.provider';
import {NemProvider} from '../../providers/nem/nem.provider';

import {LoginPage} from '../login/login';

@Component({
    selector: 'page-signup-simple-wallet',
    templateUrl: 'signup.html'
})
export class SignupSimpleWalletPage {
    newAccount: any;

    constructor(public app: App, private nem: NemProvider, private loading: LoadingController, private alert: AlertProvider, public translate: TranslateService, private alertCtrl: AlertController) {
        // sensitive data
        this.newAccount = null;

        //initializes sensitive data
        this._clearNewAccount();
    }

    /**
     * Resets senstive data
     */
    private _clearNewAccount() {
        this.newAccount = {
            'name': '',
            'password': '',
            'repeat_password': '',
            'privateKey': ''
        };
    }

    /**
     * Gets private key from a wallet from password
     * @wallet wallet to get private key from password
     */
    private _getPrivateKey(wallet) {
        this.nem.passwordToPrivateKey(this.newAccount, wallet.accounts[0], wallet.accounts[0].algo);
    }

    /**
     * Shows keep private key safe message
     */
    private _showTutorialAlert(wallet) {

        //generate private key
        this._getPrivateKey(wallet);

        let alert = this.alertCtrl.create({
            title: 'Keep Private Key safe',
            subTitle: 'Your private key holds all the power of your account. ' +
            'It is a priority to make sure it is stored safely somewhere offline.<br/><br/> <span style="text-align:center"><b>' + this.newAccount.privateKey
             + '</b></span>',
            buttons: [
                {
                    text: "I've copied it",
                    handler: _ => {
                        //clear private key just in case
                        this._clearNewAccount();
                        this.app.getRootNav().push(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }

    /**
     * Creates Simple wallet
     */
    public createSimpleWallet() {
        if (this.newAccount.password != this.newAccount.repeat_password) {
            this.alert.showPasswordDoNotMatch();
        }
        else {

            this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
                let loader = this.loading.create({
                    content: res
                });

                loader.present().then(
                    _ => {
                        this.nem.createSimpleWallet(this.newAccount.name, this.newAccount.password).then(
                            wallet => {
                                if (wallet) {
                                    loader.dismiss();
                                    this._showTutorialAlert(wallet);
                                }
                                else {
                                    loader.dismiss();
                                    this.alert.showWalletNameAlreadyExists();
                                }
                            }
                        )
                    });
            });
        }
    }
}
