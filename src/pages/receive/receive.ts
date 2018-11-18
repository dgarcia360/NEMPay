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
import {NavController, NavParams} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {LoginPage} from '../login/login';
import {MosaicTransferable, QRService, SimpleWallet} from 'nem-library';
import * as kjua from "kjua";

@Component({
    selector: 'page-receive',
    templateUrl: 'receive.html'
})
export class ReceivePage {
    private qrService: QRService;
    private selectedMosaic: MosaicTransferable;
    private selectedWallet: SimpleWallet;
    private amount: number;
    private message: string;
    private qrCode: any;

    constructor(public navCtrl: NavController, private navParams: NavParams,
                private wallet: WalletProvider, public translate: TranslateService) {
        this.selectedMosaic = <MosaicTransferable>navParams.get('selectedMosaic');
        this.amount = 0;
        this.message = '';
        this.qrCode = {'src': ''};
        this.qrService = new QRService();
    }

    ionViewWillEnter() {

        this.selectedWallet = this.wallet.getSelectedWallet();
        if (!this.selectedWallet) {
            this.navCtrl.setRoot(LoginPage);
        } else {
            this.updateQR();
        }
    }

    /**
     * Update QR code with info
     */
    public updateQR() {
        const amount =  this.amount * Math.pow(10, this.selectedMosaic.properties.divisibility);
        console.log(amount);
        let infoQR = this.qrService.generateTransactionQRText(this.selectedWallet.address, amount, this.message);
        console.log(infoQR);
        this.encodeQrCode(infoQR);
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
