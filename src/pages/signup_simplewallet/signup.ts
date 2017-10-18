import {Component} from '@angular/core';
import {App, AlertController, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { Clipboard } from '@ionic-native/clipboard';

import {AlertProvider} from '../../providers/alert/alert.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';

import {NemProvider} from '../../providers/nem/nem.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';

import {LoginPage} from '../login/login';

import {SimpleWallet} from "nem-library";

@Component({
    selector: 'page-signup-simple-wallet',
    templateUrl: 'signup.html'
})
export class SignupSimpleWalletPage {
    newAccount: any;

    constructor(public app: App, private nem: NemProvider, private wallet: WalletProvider, private loading: LoadingController, private alert: AlertProvider, public translate: TranslateService, private alertCtrl: AlertController,private toast: ToastProvider, private clipboard: Clipboard) {
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
            'repeat_password': ''
        };
    }


    /**
     * Shows keep private key safe message
     */
    private _showTutorialAlert(wallet: SimpleWallet) {
        this.translate.get(['KEEP_YOUR_PRIVATE_KEY_SAFE', 'PASSWORD_WARNING', 'IVE_COPIED_IT_MANUALLY','COPY_TO_CLIPBOARD', 'OK'], {}).subscribe((res) => {

            let alert = this.alertCtrl.create({
                title: res['KEEP_YOUR_PRIVATE_KEY_SAFE'],
                subTitle: res['PASSWORD_WARNING'] + '<br/><br/> <span style="text-align:center"><b>' + this.nem.passwordToPrivateKey(this.newAccount.password, wallet)
                + '</b></span>',
                buttons: [
                    {
                        text: res['IVE_COPIED_IT_MANUALLY'],
                        handler: _ => {
                            //clear private key just in case
                            this._clearNewAccount();
                            this.app.getRootNav().push(LoginPage);
                        }
                    },

                    {
                        text: res['COPY_TO_CLIPBOARD'],
                        handler: _ => {

                            this.clipboard.copy(this.nem.passwordToPrivateKey(this.newAccount.password, wallet)).then(_ => {
                                this.toast.showPrivateKeyCopyCorrect();
                                this._clearNewAccount();
                                this.app.getRootNav().push(LoginPage);
                            });
                            //clear private key just in case
                        }
                    }
                ],
                enableBackdropDismiss: false
            });
            alert.present();


        })
    }

    /**
     * Creates Simple wallet
     */
    public createSimpleWallet() {
        if (this.newAccount.password != this.newAccount.repeat_password) {
            this.alert.showPasswordDoNotMatch();
        }
        else if (this.newAccount.password.length < 8) {
            this.alert.showWeakPassword()
        }
        else {
            this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {

                let loader = this.loading.create({
                    content: res
                });

                loader.present().then(_ => {
                    let createdWallet = this.nem.createSimpleWallet(this.newAccount.name, this.newAccount.password);

                    this.wallet.checkIfWalletNameExists(createdWallet.name).then(value => {
                        if (value) {
                            loader.dismiss();
                            this.alert.showWalletNameAlreadyExists();
                        }
                        else {
                            this.wallet.storeWallet(createdWallet).then(value => {
                                loader.dismiss();
                                this._showTutorialAlert(createdWallet);
                            });
                        }
                    });
                });
            });
        }
    }
}