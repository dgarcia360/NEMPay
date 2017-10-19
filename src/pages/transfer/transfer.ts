import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {TranslateService} from '@ngx-translate/core';

import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';

import {BalancePage} from '../balance/balance';
import {LoginPage} from '../login/login';

import {SimpleWallet, MosaicTransferable, Address, XEM, NemAnnounceResult} from 'nem-library';
import {Observable} from "nem-library/node_modules/rxjs";

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {
    amount: number;
    rawRecipient: string;
    recipient: Address;
    selectedMosaic: MosaicTransferable;
    isMosaicTransfer: boolean;
    common: any;
    selectedWallet: SimpleWallet;
    fee: number;
    message: string;
    mosaics: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nem: NemProvider, private wallet: WalletProvider, private alert: AlertProvider, private toast: ToastProvider, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, private loading: LoadingController, private keyboard: Keyboard, public translate: TranslateService) {

        this.amount = 0;
        this.rawRecipient = navParams.get('address') || '';
        this.selectedMosaic = <MosaicTransferable>navParams.get('selectedMosaic');
        this.fee = 0;
        this.isMosaicTransfer = false;
        this.message = '';
        this.mosaics = [];

        //Stores sensitive data.
        this.common = {};

        //Initializes sensitive data.
        this._clearCommon();

    }

    ionViewWillEnter() {
        this.wallet.getSelectedWallet().then(
            value => {
                if (!value) {
                    this.navCtrl.setRoot(LoginPage);
                }
                else {
                    this.selectedWallet = value;
                }
            }
        )
    }

    /**
     * Clears sensitive data
     */
    private _clearCommon() {
        this.common = {
            'password': '',
            'privateKey': ''
        };
    }

    /**
     * Check if user can send tranaction
     * TODO: encapsulate in a service, implememntation it is duplicated in other controllers too
     */
    private _canSendTransaction() {
        if (this.common.password) {
            try {
                this.common.privateKey = this.nem.passwordToPrivateKey(this.common.password, this.selectedWallet);
                return true;
            } catch (err) {
                return false;
            }
        }
        return false;
    }

    /**
     * Confirms transaction form xem and mosaicsTransactions
     */
    private _confirmTransaction(): Observable<NemAnnounceResult> {
        let transferTransaction;
        if (this.isMosaicTransfer) transferTransaction = this.nem.prepareMosaicTransaction(this.recipient, this.mosaics, this.message);
        else transferTransaction = this.nem.prepareTransaction(this.recipient, this.amount, this.message);
        return this.nem.confirmTransaction(transferTransaction, this.selectedWallet, this.common.password);
    }

    /**
     * alert Confirmation subtitle builder
     */
    private _subtitleBuilder(res) {

        var subtitle = res['YOU_ARE_GOING_TO_SEND'] + ' <br/><br/> ';
        var currency = '';
        if (XEM.MOSAICID.equals(this.selectedMosaic.mosaicId)) {
            currency = "<b>" + res['AMOUNT'] + ":</b> " + this.amount + " xem";
        }
        else {
            currency = "<b>" + res['AMOUNT'] + "</b> " + this.amount + " " + this.selectedMosaic.mosaicId.description();
        }
        subtitle += currency;
        var _fee = this.fee / 1000000;
        subtitle += '<br/><br/>  <b>' + res['FEE'] + ':</b> ' + _fee + ' xem';

        if (this.selectedMosaic.levy != undefined && 'mosaicId' in this.selectedMosaic.levy) {
            var _levy = 0;
            return this.nem.formatLevy(this.mosaics[0]).then(value => { // TODO: format levy
                _levy = value;
                subtitle += "<br/><br/> <b>" + res['LEVY'] + ":</b> " + _levy + " " + this.selectedMosaic.levy.mosaicId.name;
                return subtitle;
            });
        }
        else {
            return Promise.resolve(subtitle);
        }
    }

    /**
     * Presents prompt to confirm the transaction, handling confirmation
     */
    private _presentPrompt() {
        this.translate.get(['YOU_ARE_GOING_TO_SEND', 'AMOUNT', 'FEE', 'LEVY', 'CONFIRM_TRANSACTION', 'PASSWORD', 'CANCEL', 'CONFIRM', 'PLEASE_WAIT'], {}).subscribe((res) => {
            this._subtitleBuilder(res).then(subtitle => {

                let alert = this.alertCtrl.create({
                    title: res['CONFIRM_TRANSACTION'],
                    subTitle: subtitle,
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
                                this.common.password = data.password;
                                let loader = this.loading.create({
                                    content: res['PLEASE_WAIT']
                                });

                                loader.present().then(_ => {
                                    if (this._canSendTransaction()) {
                                        this._confirmTransaction().subscribe(value => {
                                            loader.dismiss();
                                            console.log("Transactions confirmed");
                                            this.toast.showTransactionConfirmed();
                                            this.navCtrl.push(BalancePage, {});
                                            this._clearCommon();

                                        }, error => {
                                            console.log(error);
                                            if (error.toString().indexOf('FAILURE_INSUFFICIENT_BALANCE') >= 0) {
                                                loader.dismiss();
                                                this.alert.showDoesNotHaveEnoughFunds();
                                            }
                                            else if (error.toString().indexOf('FAILURE_MESSAGE_TOO_LARGE') >= 0) {
                                                loader.dismiss();
                                                this.alert.showMessageTooLarge();
                                            }
                                            else if (error.statusCode == 404) {
                                                loader.dismiss();
                                                this.alert.showAlertDoesNotBelongToNetwork();
                                            }
                                            else {
                                                loader.dismiss();
                                                this.alert.showError(error);
                                            }
                                        });
                                    }
                                    else {
                                        this._clearCommon();
                                        loader.dismiss();
                                        this.alert.showInvalidPasswordAlert();
                                    }
                                });
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
     * Calculates fee into this.fee and presents prompt once finished
     */
    private _updateFees() {
        let transferTransaction;
        if (this.isMosaicTransfer) transferTransaction = this.nem.prepareMosaicTransaction(this.recipient, this.mosaics, this.message);
        else transferTransaction = this.nem.prepareTransaction(this.recipient, this.amount, this.message);
        this.fee = transferTransaction.fee;
    }

    /**
     * Sets transaction amount and determine if it is mosaic or xem transaction, updating fees
     */
    public startTransaction() {
        //if is nem:xem, set amount
        if (!this.amount) this.amount = 0;

        if (!XEM.MOSAICID.equals(this.selectedMosaic.mosaicId)) {
            //if mosaic, amount represents multiplier
            this.isMosaicTransfer = true;
            this.mosaics = [new MosaicTransferable(this.selectedMosaic.mosaicId, this.selectedMosaic.properties, this.amount, this.selectedMosaic.levy)];
        }

        let recipientAddress;
        try{
            recipientAddress = new Address(this.rawRecipient.toUpperCase().replace('-', ''));
            if (!this.nem.isValidAddress(recipientAddress)) this.alert.showAlertDoesNotBelongToNetwork();
            else {
                this.recipient = recipientAddress;
                this._updateFees();
                this._presentPrompt();
            }
        }
        catch (err) {
            this.alert.showAlertDoesNotBelongToNetwork();
        }
    }

    /**
     * Scans Account QR and sets account into this.rawRecipient
     */
    public scanQR() {
        this.barcodeScanner.scan().then((barcodeData) => {
            let addresObject = JSON.parse(barcodeData.text);
            this.rawRecipient = addresObject.data.addr;
            this.amount = addresObject.data.amount;
            this.message = addresObject.data.msg;
        }, (err) => {
            console.log("Error on scan");
        });
    }
}
