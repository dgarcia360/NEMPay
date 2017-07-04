import {Component} from '@angular/core';
import {App, LoadingController} from 'ionic-angular';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {NemProvider} from '../../providers/nem/nem.provider';
import {ConfigProvider} from '../../providers/config/config.provider';

import {LoginPage} from '../login/login';

@Component({
    selector: 'page-signup-privatekey',
    templateUrl: 'signup.html'
})
export class SignupPrivateKeyPage {
    newAccount: any;

    constructor(public app: App, private nem: NemProvider, private loading: LoadingController, private alert: AlertProvider, private config: ConfigProvider) {
        this.newAccount = {
            'name': '',
            'passphrase': '',
            'private_key': '',
            'repeat_passphrase': ''
        };
    }

    /**
     * Clears sensitive data
     */
    cleanNewAccount() {
        this.newAccount = {
            'privateKey': ''
        };
    }

    /**
     * Creates Wallet from this.newAccount.private_key
     */
    public createPrivateKeyWallet() {
        if (this.newAccount.passphrase != this.newAccount.repeat_passphrase) {
            this.alert.showPasswordDoNotMatch();
        }
        else {
            let loader = this.loading.create({
                content: "Please wait..."
            });

            loader.present().then(_ => {
                this.nem.createPrivateKeyWallet(this.newAccount.name, this.newAccount.passphrase, this.newAccount.private_key, this.config.defaultNetwork()).then(
                    value => {
                        if (value) {
                            loader.dismiss();
                            this.cleanNewAccount();
                            this.app.getRootNav().push(LoginPage);
                        }
                        else {
                            loader.dismiss();
                            this.alert.showWalletNameAlreadyExists();
                        }
                    }
                )
            })
        }
    }


}
