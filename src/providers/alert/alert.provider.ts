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
import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AlertProvider {

    constructor(private alertCtrl: AlertController, private translate: TranslateService) {

    }

    showWalletNotSelectedAlert() {
        this.translate
            .get(['ALERT_NOT_WALLET_SELECTED', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_NOT_WALLET_SELECTED'],
                    buttons: [res['OK']]
                });
                alert.present();
        }), err => console.log(err);
    }

    showInvalidPasswordAlert() {
        this.translate.
        get(['ALERT_PROVIDED_PASSWORD_INVALID', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_PROVIDED_PASSWORD_INVALID'],
                    buttons: [res['OK']]
                });

                alert.present();
        }), err => console.log(err);
    }


    showPasswordDoNotMatch() {
        this.translate
            .get(['ALERT_PASSWORDS_DO_NOT_MATCH', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_PASSWORDS_DO_NOT_MATCH'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

    showWalletNameAlreadyExists() {
        this.translate
            .get(['ALERT_WALLET_NAME_ALREADY_EXISTS', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_WALLET_NAME_ALREADY_EXISTS'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

    showAlertDoesNotBelongToNetwork() {
        this.translate
            .get(['ALERT_WALLET_IS_NOT_VALID_FOR_THIS_NETWORK', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_WALLET_IS_NOT_VALID_FOR_THIS_NETWORK'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

    showDoesNotHaveEnoughFunds() {
        this.translate
            .get(['ALERT_ACCOUNT_DOES_NOT_HAVE_ENOUGH_FUNDS', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_ACCOUNT_DOES_NOT_HAVE_ENOUGH_FUNDS'],
                    buttons: [res['OK']]
                });
                alert.present();
            }), err => console.log(err);
    }

    showMessageTooLarge() {
        this.translate
            .get(['ALERT_SHOW_ATTACHED_MESSAGE_IS_TOO_LARGE', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_SHOW_ATTACHED_MESSAGE_IS_TOO_LARGE'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

    showMosaicNotTransferable() {
        this.translate
            .get(['ALERT_MOSAIC_IS_NOT_TRANSFERABLE', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_MOSAIC_IS_NOT_TRANSFERABLE'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

    showInvalidPrivateKey() {
        this.translate
            .get(['ALERT_INVALID_PRIVATE_KEY', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_INVALID_PRIVATE_KEY'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

    showWeakPassword() {
        this.translate
            .get(['ALERT_WEAK_PASSWORD', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_WEAK_PASSWORD'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

     showFunctionalityOnlyAvailableInMobileDevices() {
        this.translate
            .get(['ALERT_ONLY_MOBILE_DEVICE', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_ONLY_MOBILE_DEVICE'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }

    showContactAlreadyExists() {
        this.translate
            .get(['ALERT_CONTACT_ALREADY_EXISTS', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_CONTACT_ALREADY_EXISTS'],
                    buttons: [res['OK']]
                });

                alert.present();
            }), err => console.log(err);
    }



    showOnPhoneDisconnected() {
        this.translate
            .get(['ALERT_PHONE_DISCONNECTED', 'ALERT_SUBTITLE_PHONE_DISCONNECTED', 'OK'], {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: res['ALERT_PHONE_DISCONNECTED'],
                    subTitle: res['ALERT_SUBTITLE_PHONE_DISCONNECTED'],
                    buttons: [res['OK']]
                });
                alert.present();
            }), err => console.log(err);
    }

    showError(error) {
        this.translate
            .get('OK', {})
            .subscribe((res) => {
                let alert = this.alertCtrl.create({
                    title: error,
                    buttons: [res]
                });
                alert.present();
            }), err => console.log(err);
    }
}