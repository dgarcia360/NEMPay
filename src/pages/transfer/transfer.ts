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
import {FormControl, FormGroup} from '@angular/forms';
import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {TranslateService} from '@ngx-translate/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {NemUtils} from '../../providers/nem/nem.utils';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {BalancePage} from '../balance/balance';
import {LoginPage} from '../login/login';
import {
    Address,
    MosaicHttp,
    MosaicService,
    MosaicTransferable,
    Password,
    PlainMessage,
    SimpleWallet,
    TimeWindow,
    TransactionHttp,
    TransferTransaction,
    XEM
} from 'nem-library';
import {NemValidator} from "../../validators/nem.validator";

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {
    private transactionHttp: TransactionHttp;
    private mosaicHttp: MosaicHttp;
    private mosaicService: MosaicService;
    private transferTransactionForm: FormGroup;
    private transferTransaction: TransferTransaction;
    private selectedWallet: SimpleWallet;
    private selectedMosaic: MosaicTransferable;
    private fee: number;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nemUtils: NemUtils,
                private wallet: WalletProvider, private alert: AlertProvider, private toast: ToastProvider,
                private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController,
                private loading: LoadingController, private keyboard: Keyboard, public translate: TranslateService) {

        this.transactionHttp = new TransactionHttp();
        this.mosaicHttp = new MosaicHttp();
        this.mosaicService = new MosaicService(this.mosaicHttp);
        this.selectedMosaic =  navParams.get('selectedMosaic');

        this.transferTransactionForm = new FormGroup ({
            amount: new FormControl(0, NemValidator.isValidTransferAmount),
            rawRecipient: new FormControl(navParams.get('address') || '', NemValidator.isValidAddress),
            message: new FormControl('')
        });
    }

    ionViewWillEnter() {
        this.selectedWallet = this.wallet.getSelectedWallet();
        if (!this.selectedWallet) {
            this.navCtrl.setRoot(LoginPage);
        }
    }

    /**
     * Scans QR
     */
    public scanQR() {
        this.barcodeScanner.scan().then((barcodeData) => {
            const addressObject = JSON.parse(barcodeData.text);
            this.transferTransactionForm.patchValue({rawRecipient: addressObject.data.addr});
            const amount =  addressObject.data.amount / Math.pow(10, this.selectedMosaic.properties.divisibility);
            this.transferTransactionForm.patchValue({amount: amount });
            this.transferTransactionForm.patchValue({message: addressObject.data.msg});
        }, (err) => {
            console.log("Error on scan");
        });
    }

    /**
     * Prepares the TransferTransaction
     */
    public prepareTransaction() {

        const formValue = this.transferTransactionForm.value;
        const recipient = new Address(formValue.rawRecipient);

        if (!XEM.MOSAICID.equals(this.selectedMosaic.mosaicId)) {

            this.selectedMosaic = new MosaicTransferable(
                this.selectedMosaic.mosaicId,
                this.selectedMosaic.properties,
                formValue.amount,
                this.selectedMosaic.levy);

            this.transferTransaction = TransferTransaction
                .createWithMosaics(
                    TimeWindow.createWithDeadline(),
                    recipient,
                    [this.selectedMosaic],
                    PlainMessage.create(formValue.message));
        } else {
            this.transferTransaction = TransferTransaction
                .create(
                    TimeWindow.createWithDeadline(),
                    recipient,
                    new XEM(formValue.amount),
                    PlainMessage.create(formValue.message));
        }
        this.fee = this.transferTransaction.fee;
        this.presentPrompt();
    }

    /**
     * Builds confirmation subtitle
     */
    private subtitleBuilder(translate:string[]) {

        let subtitle = translate['YOU_ARE_GOING_TO_SEND'] + ' <br/><br/> ';
        const formValue = this.transferTransactionForm.value;

        subtitle +=  "<b>" + translate['AMOUNT'] + ":</b> ";
        if (XEM.MOSAICID.equals(this.selectedMosaic.mosaicId)) {
            subtitle += formValue.amount + " xem";
        } else {
            subtitle += formValue.amount + " " + this.selectedMosaic.mosaicId.description();
        }

        const fee = this.fee / Math.pow(10, XEM.DIVISIBILITY);
        subtitle += "<br/><br/>";
        subtitle += " <b>" + translate['FEE'] + ":</b> " + fee + " xem";

        if (this.selectedMosaic.levy != undefined && 'mosaicId' in this.selectedMosaic.levy) {
            return this.mosaicService
                .calculateLevy(this.selectedMosaic)
                .toPromise()
                .then(levy => {
                    subtitle += "<br/><br/> <b>" + translate['LEVY'] + ":</b> ";
                    subtitle += levy + " " + this.selectedMosaic.levy.mosaicId.description();
                    return subtitle;
                });
        } else {
            return Promise.resolve(subtitle);
        }
    }

    /**
     * Presents prompt to confirm the transaction
     */
    private presentPrompt() {
        this.translate
            .get(['YOU_ARE_GOING_TO_SEND', 'AMOUNT', 'FEE', 'LEVY', 'CONFIRM_TRANSACTION', 'PASSWORD', 'CANCEL',
                'CONFIRM', 'PLEASE_WAIT'], {})
            .subscribe((translate) => {

                this.subtitleBuilder(translate).then(subtitle => {

                    let alert = this.alertCtrl.create({
                        title: translate['CONFIRM_TRANSACTION'],
                        subTitle: subtitle,
                        inputs: [
                            {
                                name: 'password',
                                placeholder: translate['PASSWORD'],
                                type: 'password'
                            },
                        ],
                        buttons: [
                            {
                                text: translate['CANCEL'],
                                role: 'cancel'
                            },
                            {
                                text: translate['CONFIRM'],
                                handler: data => {
                                    this.keyboard.close();
                                    if (this.wallet.passwordMatchesWallet(data.password, this.selectedWallet)) {
                                        this.announceTransaction(data.password)
                                    } else {
                                        this.alert.showInvalidPasswordAlert();
                                    }
                                }
                            }
                        ]
                    });
                    alert.onDidDismiss(() => {
                        this.keyboard.close()
                    });
                    alert.present();
                });
            });
    }

    /**
     * Announces transaction
     * @param password  string
     */
    private announceTransaction(password: string){

        let loader = this.loading.create({
            content: this.translate['PLEASE_WAIT']
        });

        loader.present().then(_ => {

            const signedTransaction = this.selectedWallet
                .open(new Password(password))
                .signTransaction(this.transferTransaction);

            this.transactionHttp
                .announceTransaction(signedTransaction)
                .subscribe(value => {
                    loader.dismiss();
                    this.toast.showTransactionConfirmed();
                    this.navCtrl.push(BalancePage, {});
                }, err => {
                    this.throwError(err);
                    loader.dismiss();
                });
        });
    }

    /**
     * Shows error
     */
    private throwError(error: any) {
        if (error.toString().indexOf('FAILURE_INSUFFICIENT_BALANCE') >= 0) {
            this.alert.showDoesNotHaveEnoughFunds();
        } else if (error.toString().indexOf('FAILURE_MESSAGE_TOO_LARGE') >= 0) {
            this.alert.showMessageTooLarge();
        } else if (error.toString().indexOf('FAILURE_MOSAIC_NOT_TRANSFERABLE') >= 0){
            this.alert.showMosaicNotTransferable();
        } else if (error.statusCode == 404) {
            this.alert.showAlertDoesNotBelongToNetwork();
        } else {
            this.alert.showError(error);
        }
    }
}
