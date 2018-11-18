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
import {AlertController, App, Keyboard, LoadingController} from 'ionic-angular';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {TranslateService} from '@ngx-translate/core';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {LoginPage} from '../login/login';
import {Password, QRService, SimpleWallet} from "nem-library";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PasswordValidation} from "../../validators/password.validator";
import {NemValidator} from "../../validators/nem.validator";

@Component({
    selector: 'page-signup-privatekey',
    templateUrl: 'signup.html'
})
export class SignupPrivateKeyPage {
    private signupForm : FormGroup;
    private qrService: QRService;
    constructor(public app: App, private wallet: WalletProvider,
                private loading: LoadingController, private alertCtrl: AlertController,
                private alert: AlertProvider, public translate: TranslateService,
                private barcodeScanner: BarcodeScanner, private keyboard: Keyboard) {

        this.signupForm = new FormGroup ({
            name: new FormControl('', Validators.required),
            password: new FormControl('', Validators.minLength(8)),
            repeatPassword: new FormControl(''),
            privateKey: new FormControl('', NemValidator.isValidPrivateKey)
        }, PasswordValidation.EqualPasswords);
        this.qrService = new QRService();
    }

    /**
     * Scans and decrypt QR wallet
     */
    public scanWalletQR() {
        this.barcodeScanner.scan().then(barcode => {

            let walletInfo = JSON.parse(barcode.text);

            this.translate
                .get(['IMPORT_ACCOUNT_QR_WARNING', 'PASSWORD', 'CANCEL', 'CONFIRM', 'PLEASE_WAIT'], {})
                .subscribe((res) => {

                    let alert = this.alertCtrl.create({
                        title: res['PASSWORD'],
                        subTitle: res['IMPORT_ACCOUNT_QR_WARNING'],
                        inputs: [{name: 'password', placeholder: res['PASSWORD'], type: 'password'}],
                        buttons: [{text: res['CANCEL'], role: 'cancel'}, { text: res['CONFIRM'], handler: data => {

                                this.keyboard.close();
                                let loader = this.loading.create({content: res['PLEASE_WAIT']});

                                loader.present().then(ignored => {
                                    if (data.password.length < 8) {
                                        this.alert.showWeakPassword();
                                        loader.dismiss();
                                    } else {
                                        try {
                                            const privateKey =  this.qrService
                                                .decryptWalletQRText(new Password(data.password), walletInfo);
                                            this.signupForm.patchValue({'privateKey': privateKey});
                                            loader.dismiss();
                                        } catch (err) {
                                            this.alert.showInvalidPasswordAlert();
                                            loader.dismiss();
                                        }
                                    }
                                }).catch(err => console.log(err));
                            }
                        }]
                    });
                    alert.onDidDismiss(() => {
                        this.keyboard.close();
                    });

                    alert.present();
                }, err => console.log(err));

        }).catch(err => console.log("Error on scan"));
    };

    /**
     * Creates a private key wallet
     */
    public createPrivateKeyWallet() {
        const form = this.signupForm.value;
        this.translate
            .get('PLEASE_WAIT', {})
            .subscribe((res: string) => {

                let loader = this.loading.create({content: res});
                loader.present().then(ignored => {

                    this.wallet.checkIfWalletNameExists(form.name).then(exists => {
                        if (exists) {
                            loader.dismiss();
                            this.alert.showWalletNameAlreadyExists();
                        } else {
                            try {
                                const createdWallet = SimpleWallet
                                    .createWithPrivateKey(form.name, new Password(form.password), form.privateKey);
                                this.wallet.storeWallet(createdWallet).then(ignored => {
                                    loader.dismiss();
                                    this.app.getRootNav().push(LoginPage);
                                });
                            } catch (e) {
                                loader.dismiss();
                                this.alert.showInvalidPrivateKey();
                            }
                        }
                    });
                });
            }, err => console.log(err));
    }
}
