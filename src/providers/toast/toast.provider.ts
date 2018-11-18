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
import {ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ToastProvider {

    constructor(private toast: ToastController, private translate: TranslateService) {

    }

    showTransactionConfirmed() {
        this.translate
            .get('ALERT_TRANSACTION_CONFIRMED', {})
            .subscribe((res: string) => {
                let toast = this.toast.create({
                    message: res,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            }), err => console.log(err);
    }

    showAddressCopyCorrect() {
        this.translate
            .get('ALERT_ADDRESS_COPIED', {})
            .subscribe((res: string) => {
                let toast = this.toast.create({
                    message: res,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
        }), err => console.log(err);
    }

    showPrivateKeyCopyCorrect() {
        this.translate
            .get('ALERT_PRIVATE_KEY_COPIED', {})
            .subscribe((res: string) => {
                let toast = this.toast.create({
                    message: res,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
        }), err => console.log(err);
    }

    showContactCreated() {
        this.translate
            .get('CONTACT_CREATED', {})
            .subscribe((res: string) => {
                let toast = this.toast.create({
                    message: res,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            }), err => console.log(err);
    }

    showContactUpdated() {
        this.translate
            .get('CONTACT_UPDATED', {})
            .subscribe((res: string) => {
                let toast = this.toast.create({
                    message: res,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            }), err => console.log(err);
    }
}