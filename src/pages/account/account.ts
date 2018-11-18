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
import {LoadingController, NavController, Platform} from 'ionic-angular';
import {Subscription} from 'rxjs';
import {SocialSharing} from '@ionic-native/social-sharing';
import {Clipboard} from '@ionic-native/clipboard';
import {TranslateService} from '@ngx-translate/core';
import * as kjua from "kjua";
import {AlertProvider} from '../../providers/alert/alert.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';
import {LoginPage} from "../login/login";
import {Password, QRService, SimpleWallet} from "nem-library";
import {NemUtils} from "../../providers/nem/nem.utils";

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})

export class AccountPage {
    private qrService: QRService;
    private password: string;
    private privateKey: string;
    private selectedWallet: SimpleWallet;
    private qrCode: any;
    private onResumeSubscription: Subscription;

    constructor(public navCtrl: NavController, private nemUtils: NemUtils, private wallet: WalletProvider,
                private socialSharing: SocialSharing, private loading: LoadingController, private alert: AlertProvider,
                private platform: Platform, public translate: TranslateService, private toast: ToastProvider,
                private clipboard: Clipboard) {

        this.qrService = new QRService();
        this.clearPrivateKey();
        this.qrCode = {'src': ''};

        //clear common if app paused
        this.onResumeSubscription = platform.resume
            .subscribe(ignored => this.clearPrivateKey(),
                err => console.log(err));
    }

    /**
     * Init page with QR and current wallet info
     */
    ionViewWillEnter() {
        this.selectedWallet = this.wallet.getSelectedWallet();
        if (!this.selectedWallet) {
            this.navCtrl.setRoot(LoginPage);
        } else {
            let infoQR = this.qrService.generateAddressQRText(this.selectedWallet.address);
            this.encodeQrCode(infoQR);
        }
    }

    /**
     * Shares the address using phone's native apps
     */
    public shareAddress() {
        if (this.platform.is('cordova')) {
            let textToShare = this.selectedWallet.address;
            this.socialSharing
                .share(textToShare.plain(), "My NEM Address", null, null)
                .then(ignored => {})
                .catch(err => console.log(err));
        } else {
            this.alert.showFunctionalityOnlyAvailableInMobileDevices();
        }
    }

    /**
     * Shows selectedWallet private's key if the provided password is correct
     */
    public showPrivateKey() {
        this.translate
            .get('PLEASE_WAIT', {})
            .subscribe((res: string) => {
                let loader = this.loading.create({content: res});
                loader.present().then(_ => {

                    if (!this.wallet.passwordMatchesWallet(this.password, this.selectedWallet)) {
                        this.clearPrivateKey();
                        this.alert.showInvalidPasswordAlert();
                    } else {
                        this.privateKey = this.selectedWallet.unlockPrivateKey(new Password(this.password));
                    }
                    loader.dismiss();
                }).catch(err => console.log(err));
            }, err => console.log(err));
    }

    /**
     * Copies the private key to clipboard
     */
    public copyPrivateKeyToClipboard() {
        if (this.platform.is('cordova')) {
            this.clipboard.copy(this.privateKey).then(ignored => {
                this.toast.showPrivateKeyCopyCorrect();
            });
        } else {
            this.alert.showFunctionalityOnlyAvailableInMobileDevices();
        }
    }

    /**
     * Moves to login screen
     */
    public logout() {
        this.wallet.unsetSelectedWallet();
        this.clearPrivateKey();
        this.navCtrl.setRoot(LoginPage);
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

    /**
     * Clears sensitive data
     */
    private clearPrivateKey() {
        this.password = '';
        this.privateKey = '';
    }

    /**
     * Encodes infoQR json into an image
     * @param infoQR  Object containing account information
     */
    private encodeQrCode(infoQR) {
        this.qrCode = kjua({
            size: 256,
            text: infoQR,
            fill: '#000',
            quiet: 0,
            ratio: 2,
        });
    }

}

