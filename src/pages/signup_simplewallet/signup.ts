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
import {AlertController, App, LoadingController, Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Clipboard} from '@ionic-native/clipboard';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {LoginPage} from '../login/login';
import {Password, SimpleWallet} from "nem-library";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PasswordValidation} from "../../validators/password.validator";

@Component({
    selector: 'page-signup-simple-wallet',
    templateUrl: 'signup.html'
})
export class SignupSimpleWalletPage {
    private signupForm: FormGroup;

    constructor(public app: App, private wallet: WalletProvider,
                private loading: LoadingController, private alert: AlertProvider, public translate: TranslateService,
                private alertCtrl: AlertController, private toast: ToastProvider, private clipboard: Clipboard,
                private platform: Platform) {

        this.signupForm = new FormGroup ({
            name: new FormControl('', Validators.required),
            password: new FormControl('', Validators.minLength(8)),
            repeatPassword: new FormControl('')
        }, PasswordValidation.EqualPasswords);
    }

    /**
     * Creates Simple wallet
     */
    public createSimpleWallet() {
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

                            const createdWallet = SimpleWallet.create(form.name, new Password(form.password));
                            this.wallet.storeWallet(createdWallet).then(value => {
                                loader.dismiss();
                                this.showTutorialAlert(createdWallet);
                            });
                        }
                    });
                });
            }, err => console.log(err));
    }

    /**
     * Shows keep private key safe message
     */
    private showTutorialAlert(wallet: SimpleWallet) {
        const form = this.signupForm.value;
        this.translate
            .get(['KEEP_YOUR_PRIVATE_KEY_SAFE', 'PASSWORD_WARNING', 'IVE_COPIED_IT_MANUALLY',
                'COPY_TO_CLIPBOARD', 'OK'], {})
            .subscribe((res) => {

                let alert = this.alertCtrl.create({
                    title: res['KEEP_YOUR_PRIVATE_KEY_SAFE'],
                    subTitle: res['PASSWORD_WARNING'] + '<br/><br/> ' +
                    '<span style="text-align:center"><b>' + wallet.unlockPrivateKey(new Password(form.password))
                    + '</b></span>',
                    buttons: [
                        {
                            text: res['IVE_COPIED_IT_MANUALLY'],
                            handler: ignored => {
                                this.app.getRootNav().push(LoginPage);
                            }
                        },
                        {
                            text: res['COPY_TO_CLIPBOARD'],
                            handler: ignored => {

                                if (this.platform.is('cordova')) {
                                    this.clipboard
                                        .copy(wallet.unlockPrivateKey(new Password(form.password)))
                                        .then(_ => {
                                            this.toast.showPrivateKeyCopyCorrect();
                                            this.app.getRootNav().push(LoginPage);
                                        });
                                } else {
                                    this.alert.showFunctionalityOnlyAvailableInMobileDevices();
                                }
                            }
                        }
                    ], enableBackdropDismiss: false
                });

                alert.present();
            }, err => console.log(err));
    }
}