import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {TranslateService} from '@ngx-translate/core';

import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';

import {LoginPage} from '../login/login';

import {SimpleWallet, MosaicTransferable} from 'nem-library';

import 'rxjs/add/operator/toPromise';
import * as kjua from "kjua";

@Component({
    selector: 'page-receive',
    templateUrl: 'receive.html'
})
export class ReceivePage {
    selectedMosaic: MosaicTransferable;
    selectedWallet: SimpleWallet;
    amount: number;
    message: any;
    qrCode: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nem: NemProvider, private wallet: WalletProvider, private alert: AlertProvider, private toast: ToastProvider, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, private loading: LoadingController, private keyboard: Keyboard, public translate: TranslateService) {

        this.amount = 0;
        this.selectedMosaic = <MosaicTransferable>navParams.get('selectedMosaic');
        this.message = '';
        this.qrCode = {'src': ''};
    }

    ionViewWillEnter() {
        this.wallet.getSelectedWallet().then(
            value => {
                if (!value) {
                    this.navCtrl.setRoot(LoginPage);
                }
                else {
                    this.selectedWallet = value;
                    this.updateQR();
                }
            }
        )
    }


  /**
     * Encodes infoQR json into an image
     * @param infoQR  Object containing account information
     */
    private _encodeQrCode(infoQR) {
        this.qrCode = kjua({
            size: 256,
            text: infoQR,
            fill: '#000',
            quiet: 0,
            ratio: 2,
        });
    }

     /**
     * Update QR code with info
     */
    public updateQR() {
        let infoQR = this.nem.generateInvoiceQRText(this.selectedWallet.address, this.amount, this.message);
        this._encodeQrCode(infoQR);

    }


}
