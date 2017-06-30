import {Component} from '@angular/core';
import {App, LoadingController} from 'ionic-angular';
import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';

import {LoginPage} from '../login/login';

@Component({
    selector: 'page-signup-brainwallet',
    templateUrl: 'signup.html'
})
export class SignupBrainWalletPage {
    newAccount: any;

    constructor(private app: App, private nem: NemProvider, private loading: LoadingController, private alert: AlertProvider) {
        this.newAccount = {
            'name': '',
            'passphrase': '',
            'repeat_passphrase': ''
        };
    }

    public createBrainWallet() {

        if (this.newAccount.passphrase != this.newAccount.repeat_passphrase) {
            this.alert.showPasswordDoNotMatch();
        }
        else {
            let loader = this.loading.create({
                content: "Please wait..."
            });

            loader.present().then(_ => {
                this.nem.createBrainWallet(this.newAccount.name, this.newAccount.passphrase, -104).then(
                    value => {
                        if (value) {
                            loader.dismiss();
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
