import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';

import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';

import {BalancePage} from '../balance/balance';
import {LoginPage} from '../login/login';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {

    formData: any;
    selectedMosaic: any;
    divisibility: any;
    levy: any;
    common: any;
    amount: number;
    selectedWallet: any;
    selectedMosaicDefinitionMetaDataPair: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nem: NemProvider, private alert: AlertProvider, private toast: ToastProvider, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, private loading: LoadingController, private keyboard: Keyboard) {

        this.formData = {};
        this.amount = 0;
        this.formData.recipientPubKey = '';
        this.formData.message = '';
        this.selectedMosaic = navParams.get('selectedMosaic');
        this.formData.fee = 0;
        this.formData.encryptMessage = false;
        this.formData.innerFee = 0;
        this.formData.isMultisig = false;
        this.formData.isMosaicTransfer = false;
        this.formData.message = '';
        this.selectedMosaicDefinitionMetaDataPair = undefined;
        this.levy = undefined;
        this.divisibility = undefined;

        this.common = {
            'password': '',
            'privateKey': '',
        };

        if (this.selectedMosaic != 'nem:xem') {
            this.nem.getMosaicsMetaDataPair(this.selectedMosaic.split(":")[0], this.selectedMosaic.split(":")[1]).then(
                value => {
                    this.selectedMosaicDefinitionMetaDataPair = value[this.selectedMosaic];
                    this.levy = value[this.selectedMosaic].mosaicDefinition.levy;
                    this.divisibility = value[this.selectedMosaic].mosaicDefinition.properties[0].value;
                    this.formData.isMosaicTransfer = true;
                }
            )
        }
    }


    ionViewWillEnter() {
        this.nem.getSelectedWallet().then(
            value => {
                if (!value) {
                    this.navCtrl.push(LoginPage);
                }
                else {
                    this.selectedWallet = value;
                }
            }
        )
    }

    cleanCommon() {
        this.common = {
            'password': '',
            'privateKey': ''
        };
    }


    /**
     * resetRecipientData() Reset data stored for recipient
     */
    resetRecipientData() {
        // Reset public key data
        this.formData.recipientPubKey = '';
        // Reset cleaned recipient address
        this.formData.recipient = '';
        // Encrypt message set to false
        this.formData.encryptMessage = false;
    }


    checkAddress(address) {
        var success = true;
        // Check if address is from network
        if (this.nem.isFromNetwork(address, -104)) {
            this.formData.recipient = address;
        }
        else {
            this.resetRecipientData();
            success = false;
        }
        return success;
    }


    /**
     * processRecipientInput() Process recipient input and get data from network
     *
     * @note: I'm using debounce in view to get data typed with a bit of delay,
     * it limits network requests
     */
    processRecipientInput() {
        // Reset recipient data
        this.resetRecipientData();
        var success = true;
        // return if no value or address length < to min address length
        if (!this.formData.rawRecipient || this.formData.rawRecipient.length < 40) {
            success = false;
        }

        // Get recipient data depending of address
        // Clean address
        if (success) {
            let recipientAddress = this.formData.rawRecipient.toUpperCase().replace(/-/g, '');
            success = this.checkAddress(recipientAddress);
        }
        return success;
    }

    presentPrompt() {
        let loader = this.loading.create({
            content: "Please wait..."
        });

        this._subtitleBuilder().then(subitle => {
            let alert = this.alertCtrl.create({
                title: 'Confirm Transaction',
                subTitle: subitle,
                inputs: [
                    {
                        name: 'passphrase',
                        placeholder: 'Passphrase/Password',
                        type: 'password'
                    },
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    },
                    {
                        text: 'Confirm Transaction',
                        handler: data => {
                            this.keyboard.close();
                            this.common.password = data.passphrase;
                            loader.present().then(_ => {
                                if (this.canSendTransaction()) {
                                    this.confirmTransaction().then(value => {
                                        if (value.message == 'SUCCESS') {
                                            loader.dismiss();
                                            console.log("Transactions confirmed");
                                            this.toast.showTransactionConfirmed();
                                            this.navCtrl.push(BalancePage, {});
                                            this.cleanCommon();
                                        }
                                        else if (value.message == 'FAILURE_INSUFFICIENT_BALANCE') {
                                            loader.dismiss();
                                            this.alert.showDoesNotHaveEnoughFunds();
                                        }
                                        else if (value.message == 'FAILURE_MESSAGE_TOO_LARGE') {
                                            loader.dismiss();
                                            this.alert.showMessageTooLarge();
                                        }
                                        else {
                                            loader.dismiss();
                                            this.alert.showError(value.message);
                                        }
                                    });
                                }
                                else {
                                    this.common.privateKey = '';
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
            })
            alert.present();
        });
    }


    updateFees() {
        if (this.formData.isMosaicTransfer) {
            this.nem.prepareMosaicTransaction(this.common, this.formData).then(entity => {
                this.formData.innerFee = 0;
                this.formData.fee = entity.fee;
                this.presentPrompt();
            });
        }
        else {
            var entity = this.nem.prepareTransaction(this.common, this.formData);
            this.formData.innerFee = 0;
            this.formData.fee = entity.fee;
            this.presentPrompt();
        }
    }


    startTransaction() {
        //if is nem:xem, set amount
        if (this.selectedMosaic == 'nem:xem') {
            this.formData.mosaics = [];
            this.formData.amount = this.amount;
        }
        else {
            this.formData.amount = 1; // Always send 1
            var namespace_mosaic = this.selectedMosaic.split(":");
            this.formData.mosaics = [{
                'mosaicId': {
                    'namespaceId': namespace_mosaic[0],
                    'name': namespace_mosaic[1]
                },
                'quantity': this.amount * Math.pow(10, this.divisibility)
            }];
        }
        if (!this.processRecipientInput()) {
            this.alert.showAlertDoesNotBelongToNetwork();
        }
        else {
            this.updateFees();
        }
    }

    private _subtitleBuilder(): Promise<string> {
        var subtitle = 'You are going to send: <br/><br/> ';
        var currency = '';
        if (this.selectedMosaic == 'nem:xem') {
            currency = "<b>Amount:</b> " + this.amount + " xem";
        }
        else {
            currency = "<b>Amount:</b> " + this.amount + " " + this.selectedMosaic;
        }
        subtitle += currency;

        var _fee = this.formData.fee / 1000000;

        subtitle += '<br/><br/>  <b>Fee:</b> ' + _fee + ' xem';

        if (this.levy != undefined && 'mosaicId' in this.levy) {
            var _levy = 0;
            return this.nem.formatLevy(this.formData.mosaics[0], 1, this.levy).then(value => {
                _levy = value
                subtitle += "<br/><br/> <b>Levy:</b> " + _levy + " " + this.levy.mosaicId.name;
                return subtitle;
            });
        }
        else {
            return Promise.resolve(subtitle);
        }

    }

    canSendTransaction() {
        var result = this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo);
        if (!(this.common.privateKey.length === 64 || this.common.privateKey.length === 66)) result = false;
        return result;
    }

    confirmTransaction() {

        if (this.formData.isMosaicTransfer) {
            return this.nem.prepareMosaicTransaction(this.common, this.formData).then(entity => {
                return this.nem.confirmTransaction(this.common, entity);
            });
        }

        else {
            var entity = this.nem.prepareTransaction(this.common, this.formData);
            return this.nem.confirmTransaction(this.common, entity);
        }
    }

    scanQR() {
        this.barcodeScanner.scan().then((barcodeData) => {
            var addresObject = JSON.parse(barcodeData.text);
            this.formData.rawRecipient = addresObject.data.addr;
        }, (err) => {
            console.log("Error on scan");
        });
    }
}
