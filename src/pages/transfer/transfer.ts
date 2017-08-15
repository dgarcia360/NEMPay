import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {TranslateService} from '@ngx-translate/core';

import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';

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
    formData: any;
    selectedMosaic: MosaicTransferable;
    divisibility: any;
    levy: any;
    common: any;
    amount: number;
    selectedWallet: SimpleWallet;
    selectedMosaicDefinitionMetaDataPair: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nem: NemProvider, private alert: AlertProvider, private toast: ToastProvider, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, private loading: LoadingController, private keyboard: Keyboard, public translate: TranslateService) {

        this.formData = {};
        this.amount = 0;
        this.formData.recipientPubKey = '';
        this.selectedMosaic = <MosaicTransferable>navParams.get('selectedMosaic');
        this.formData.fee = 0;
        this.formData.innerFee = 0;
        this.formData.isMultisig = false;
        this.formData.isMosaicTransfer = false;
        this.formData.message = '';

        //Stores sensitive data.
        this.common = {};

        //Initializes sensitive data.
        this._clearCommon();

    }

    ionViewWillEnter() {
        this.nem.getSelectedWallet().then(
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
     * Resets recipient data
     */
    private _resetRecipientData() {
        // Reset public key data
        this.formData.recipientPubKey = '';
        // Reset cleaned recipient address
        this.formData.recipient = '';
    }


    /**
     * check if address is from network
     * @param address Adrress to check
     */
    private _checkAddress(address) {
        var success = true;
        if (this.nem.isFromNetwork(address)) {
            this.formData.recipient = address;
        }
        else {
            this._resetRecipientData();
            success = false;
        }
        return success;
    }

    /**
     * Cleans this.fromData.rawRecipient and check if account belongs to network
     */
    private _processRecipientInput() {
        // Reset recipient data
        this._resetRecipientData();
        var success = true;
        // return if no value or address length < to min address length
        if (!this.formData.rawRecipient || this.formData.rawRecipient.length < 40) {
            success = false;
        }
        //if raw data, clean address and check if it is from network
        if (success) {
            let recipientAddress = this.formData.rawRecipient.toUpperCase().replace(/-/g, '');
            success = this._checkAddress(new Address(recipientAddress));
        }
        return success;
    }

    /**
     * Check if user can send tranaction
     * TODO: encapsulate in a service, implememntation it is duplicatedin other controllers too
     */
    private _canSendTransaction() {
        var result = false;
        if (this.common.password) {
            // TODO: try to open account
            result = this.nem.passwordToPrivateKey(this.common, this.selectedWallet);
            if (!(this.common.privateKey.length === 64 || this.common.privateKey.length === 66)) result = false;
        }
        return result;
    }

    /**
     * Confirms transaction form xem and mosaicsTransactions
     */
    private _confirmTransaction(): Observable<NemAnnounceResult> {
        let transferTransaction;

        if (this.formData.isMosaicTransfer) {
            transferTransaction = this.nem.prepareMosaicTransaction(this.formData.recipient, this.formData.mosaics, this.formData.message);
        }
        else {
            transferTransaction = this.nem.prepareTransaction(this.formData.recipient, this.formData.amount, this.formData.message);
        }

        return this.nem.confirmTransaction(transferTransaction, this.selectedWallet, this.common.password);
    }

    /**
     * alert Confirmation subtitle builder
     */
    private _subtitleBuilder(res){

        var subtitle = res['YOU_ARE_GOING_TO_SEND'] + ' <br/><br/> ';
        var currency = '';
        if (XEM.MOSAICID.equals(this.selectedMosaic.mosaicId)) {
            currency = "<b>"+res['AMOUNT']+":</b> " + this.amount + " xem";
        }
        else {
            currency = "<b>"+res['AMOUNT']+"</b> " + this.amount + " " + this.selectedMosaic.mosaicId.description();
        }
        subtitle += currency;

        var _fee = this.formData.fee / 1000000;

        subtitle += '<br/><br/>  <b>'+res['FEE']+':</b> ' + _fee + ' xem';

        if (this.selectedMosaic.levy != undefined && 'mosaicId' in this.selectedMosaic.levy) {
            var _levy = 0;
            return this.nem.formatLevy(this.formData.mosaics[0]).then(value => { // TODO: format levy
                _levy = value
                subtitle += "<br/><br/> <b>"+res['LEVY']+":</b> " + _levy + " " + this.selectedMosaic.levy.mosaicId.name;
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
        this.translate.get(['YOU_ARE_GOING_TO_SEND','AMOUNT','FEE', 'LEVY', 'CONFIRM_TRANSACTION', 'PASSWORD','CANCEL','CONFIRM'], {}).subscribe((res) => {
            console.log(res);
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
                                this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
                                    let loader = this.loading.create({
                                        content: res
                                    });

                                    loader.present().then(
                                        _ => {
                                            if (this._canSendTransaction()) {
                                                this._confirmTransaction().subscribe(value => {
                                                    console.log(value);
                                                    loader.dismiss();
                                                    console.log("Transactions confirmed");
                                                    this.toast.showTransactionConfirmed();
                                                    this.navCtrl.push(BalancePage, {});
                                                    this._clearCommon();

                                                }, error => {
                                                    if (error.toString() == 'FAILURE_INSUFFICIENT_BALANCE') {
                                                        loader.dismiss();
                                                        this.alert.showDoesNotHaveEnoughFunds();
                                                    }
                                                    else if (error.toString() == 'FAILURE_MESSAGE_TOO_LARGE') {
                                                        loader.dismiss();
                                                        this.alert.showMessageTooLarge();
                                                    }
                                                    else {
                                                        loader.dismiss();
                                                        this.alert.showError(error);
                                                    }
                                                });
                                            }
                                            else {
                                                this.common.privateKey = '';
                                                loader.dismiss();
                                                this.alert.showInvalidPasswordAlert();
                                            }
                                        });
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
     * Calculates fee into this.formData.fee and presents prompt once finished
     * TODO: Resolve both ifs with a promise, and handle presentPrompt in startTransaction
     */
    private _updateFees() {
        var transferTransaction;
        if (this.formData.isMosaicTransfer) {
            transferTransaction = this.nem.prepareMosaicTransaction(this.formData.recipient, this.formData.mosaics, this.formData.message);
        }
        else {
            transferTransaction = this.nem.prepareTransaction(this.formData.recipient, this.formData.amount, this.formData.message);
        }
        this.formData.innerFee = 0;
        this.formData.fee = transferTransaction.fee;
        this._presentPrompt();
    }

    /**
     * Sets transaction amount and determine if it is mosaic or xem transaction, updating fees
     */
    public startTransaction() {
        //if is nem:xem, set amount
        if (!this.amount) this.amount = 0;

        if (XEM.MOSAICID.equals(this.selectedMosaic.mosaicId)) {
            this.formData.mosaics = [];
            this.formData.amount = this.amount;
        }
        else {
            //if mosaic, amount represents multiplier
            this.formData.isMosaicTransfer = true;
            this.formData.amount = 1;
            this.formData.mosaics = [new MosaicTransferable(this.selectedMosaic.mosaicId, this.selectedMosaic.properties, this.amount, this.selectedMosaic.levy)];

        }
        if (!this._processRecipientInput()) {
            this.alert.showAlertDoesNotBelongToNetwork();
        }
        else {
            this._updateFees();
        }
    }

    /**
     * Scans Account QR and sets account into this.formData.rawRecipient
     */
    public scanQR() {
        this.barcodeScanner.scan().then((barcodeData) => {
            var addresObject = JSON.parse(barcodeData.text);
            this.formData.rawRecipient = addresObject.data.addr;
            this.formData.amount = addresObject.data.amount;
            this.formData.message = addresObject.data.msg;
        }, (err) => {
            console.log("Error on scan");
        });
    }
}
