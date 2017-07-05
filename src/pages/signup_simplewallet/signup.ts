import {Component} from '@angular/core';
import {App, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {AlertProvider} from '../../providers/alert/alert.provider';
import {ConfigProvider} from '../../providers/config/config.provider';
import {NemProvider} from '../../providers/nem/nem.provider';

import {LoginPage} from '../login/login';

@Component({
    selector: 'page-signup-simple-wallet',
    templateUrl: 'signup.html'
})
export class SignupSimpleWalletPage {
    newAccount: any;

    constructor(public app: App, private nem: NemProvider, private loading: LoadingController, private alert: AlertProvider, private config: ConfigProvider, public translate: TranslateService) {
        this.newAccount = {
            'name': '',
            'password': '',
            'repeat_password': ''
        };
    }

    public createSimpleWallet() {
        if (this.newAccount.password != this.newAccount.repeat_password) {
            this.alert.showPasswordDoNotMatch();
        }
        else {
            let loader = this.loading.create({
                content: "Please wait..."
            });

            loader.present().then(_ => {
                this.nem.createSimpleWallet(this.newAccount.name, this.newAccount.password, this.config.defaultNetwork()).then(
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
