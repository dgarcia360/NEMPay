import {Component} from '@angular/core';
import {App, LoadingController, AlertController, Keyboard} from 'ionic-angular';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {TranslateService} from '@ngx-translate/core';

import {AlertProvider} from '../../providers/alert/alert.provider';
import {NemProvider} from '../../providers/nem/nem.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';

import {LoginPage} from '../login/login';

@Component({
    selector: 'page-signup-privatekey',
    templateUrl: 'signup.html'
})
export class SignupPrivateKeyPage {
    newAccount: any;

    constructor(public app: App, private nem: NemProvider, private wallet: WalletProvider, private loading: LoadingController, private alertCtrl: AlertController, private alert: AlertProvider, public translate: TranslateService, private barcodeScanner: BarcodeScanner, private keyboard: Keyboard) {
        //sensitive data
        this.newAccount = null;

        //initialize senstivie data
        this._clearNewAccount();
    }

    /**
     * Clears sensitive data
     */
    private _clearNewAccount() {
        this.newAccount = {
            'name': '',
            'password': '',
            'private_key': '',
            'repeat_password': ''
        };
    }


    /**
     * Scans wallet QR and stores its private key in newAccount.privateKey
     */
    public scanWalletQR() {
        this.barcodeScanner.scan().then(barcode => {

            let walletInfo = JSON.parse(barcode.text);

            this.translate.get(['IMPORT_ACCOUNT_QR_WARNING', 'PASSWORD', 'CANCEL', 'CONFIRM', 'PLEASE_WAIT'], {}).subscribe((res) => {

                let alert = this.alertCtrl.create({
                    title: res['PASSWORD'],
                    subTitle: res['IMPORT_ACCOUNT_QR_WARNING'],
                    inputs: [
                        {
                            name: 'password',
                            placeholder: res['PASSWORD'],
                            type: 'password'
                        },
                    ],
                    buttons: [
                        {
                            text: res['CANCEL'],
                            role: 'cancel'
                        },
                        {
                            text: res['CONFIRM'],
                            handler: data => {
                                this.keyboard.close();
                                let loader = this.loading.create({
                                    content: res['PLEASE_WAIT']
                                });

                                loader.present().then(_ => {
                                    if (data.password < 8) {
                                        this.alert.showWeakPassword();
                                        loader.dismiss();
                                    }
                                    else {
                                        try {
                                            this.newAccount.private_key = this.nem.decryptPrivateKey(data.password, walletInfo);
                                            loader.dismiss();
                                        } catch (err) {
                                            this.alert.showInvalidPasswordAlert();
                                            loader.dismiss();
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
                alert.onDidDismiss(() => {
                    this.keyboard.close();
                });

                alert.present();
            });

        }).catch(err => {
            console.log("Error on scan");
        });
    };

    /**
     * Creates Wallet from this.newAccount.private_key
     */
    public createPrivateKeyWallet() {
        if (this.newAccount.password != this.newAccount.repeat_password) {
            this.alert.showPasswordDoNotMatch();
        }
        else if (!(this.newAccount.private_key.length != 64 || this.newAccount.private_key.length != 66)) {
            this.alert.showInvalidPrivateKey();
        }
        else if (this.newAccount.password.length < 8) {
            this.alert.showWeakPassword();
        }
        else {

            this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
                let loader = this.loading.create({
                    content: res
                });

                loader.present().then(_ => {
                    let createdWallet;
                    try {
                        createdWallet = this.nem.createPrivateKeyWallet(this.newAccount.name, this.newAccount.password, this.newAccount.private_key);
                    }
                    catch (e) {
                        loader.dismiss();
                        this.alert.showInvalidPrivateKey();
                    }

                    if (createdWallet) {
                        this.wallet.checkIfWalletNameExists(createdWallet.name).then(value => {
                            if (value) {
                                loader.dismiss();
                                this.alert.showWalletNameAlreadyExists();
                            }
                            else {
                                this.wallet.storeWallet(createdWallet).then(value => {
                                    loader.dismiss();
                                    this._clearNewAccount();
                                    this.app.getRootNav().push(LoginPage);
                                });
                            }
                        });
                    }
                });
            });
        }
    }
}
