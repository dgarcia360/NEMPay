import {Component} from '@angular/core';
import {App, LoadingController} from 'ionic-angular';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {TranslateService} from '@ngx-translate/core';

import {AlertProvider} from '../../providers/alert/alert.provider';
import {NemProvider} from '../../providers/nem/nem.provider';

import {LoginPage} from '../login/login';

@Component({
    selector: 'page-signup-privatekey',
    templateUrl: 'signup.html'
})
export class SignupPrivateKeyPage {
    newAccount: any;

    constructor(public app: App, private nem: NemProvider, private loading: LoadingController, private alert: AlertProvider, public translate: TranslateService,private barcodeScanner: BarcodeScanner) {
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

            var walletInfo = JSON.parse(barcode.text);
            if (!this.newAccount.password){
                this.alert.showBarCodeScannerRequiresPassword();
            }
            else if (this.newAccount.password != this.newAccount.repeat_password) {
                this.alert.showPasswordDoNotMatch();
            }
            else{
                try{
                    this.newAccount.private_key = this.nem.decryptPrivateKey(this.newAccount.password, walletInfo);                    
                } catch (err) {
                    this.alert.showInvalidPasswordAlert();                    
                }
            }
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
        else if (!(this.newAccount.private_key.length != 64 || this.newAccount.private_key.length != 66)){
            this.alert.showInvalidPrivateKey();
        }
        else if (this.newAccount.password.length < 8) {
            this.alert.showWeakPassword()
        }
        else{

            this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
                let loader = this.loading.create({
                    content: res
                });

                loader.present().then(
                    _ => {

                        this.nem.createPrivateKeyWallet(this.newAccount.name, this.newAccount.password, this.newAccount.private_key).then(
                            wallet => {
                                if (wallet) {
                                    loader.dismiss();
                                    this._clearNewAccount();
                                    this.app.getRootNav().push(LoginPage);
                                }
                                else {
                                    loader.dismiss();
                                    this.alert.showWalletNameAlreadyExists();
                                }
                            }
                        ).catch(_ => {
                            loader.dismiss();
                            this.alert.showInvalidPrivateKey();
                        });
                    });
            });
        }
    }
}
