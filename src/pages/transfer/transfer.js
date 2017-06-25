var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NemProvider } from '../../providers/nem/nem.provider';
import { AlertProvider } from '../../providers/alert/alert.provider';
import { BalancePage } from '../balance/balance';
import { LoginPage } from '../login/login';
var TransferPage = (function () {
    function TransferPage(navCtrl, navParams, nem, alert, barcodeScanner, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.nem = nem;
        this.alert = alert;
        this.barcodeScanner = barcodeScanner;
        this.alertCtrl = alertCtrl;
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
            this.nem.getMosaicsMetaDataPair(this.selectedMosaic.split(":")[0], this.selectedMosaic.split(":")[1], false).then(function (value) {
                _this.selectedMosaicDefinitionMetaDataPair = value;
                _this.levy = value.levy;
                _this.divisibility = value.properties[0].value;
                _this.formData.isMosaicTransfer = true;
            });
        }
    }
    TransferPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.nem.getSelectedWallet().then(function (value) {
            if (!value) {
                _this.navCtrl.push(LoginPage);
            }
            else {
                _this.selectedWallet = value;
            }
        });
    };
    TransferPage.prototype.cleanCommon = function () {
        this.common = {
            'password': '',
            'privateKey': ''
        };
    };
    /**
         * resetRecipientData() Reset data stored for recipient
         */
    TransferPage.prototype.resetRecipientData = function () {
        // Reset public key data
        this.formData.recipientPubKey = '';
        // Reset cleaned recipient address
        this.formData.recipient = '';
        // Encrypt message set to false
        this.formData.encryptMessage = false;
    };
    TransferPage.prototype.checkAddress = function (address) {
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
    };
    /**
     * processRecipientInput() Process recipient input and get data from network
     *
     * @note: I'm using debounce in view to get data typed with a bit of delay,
     * it limits network requests
     */
    TransferPage.prototype.processRecipientInput = function () {
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
            var recipientAddress = this.formData.rawRecipient.toUpperCase().replace(/-/g, '');
            success = this.checkAddress(recipientAddress);
        }
        return success;
    };
    TransferPage.prototype.presentPrompt = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Confirm Transaction',
            subTitle: this._subtitleBuilder(),
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
                    handler: function (data) {
                        _this.common.password = data.passphrase;
                        if (_this.canSendTransaction()) {
                            _this.confirmTransaction().then(function (_) {
                                _this.navCtrl.push(BalancePage, { sendSuccess: true });
                                _this.cleanCommon();
                            }).catch(function (error) {
                                _this.alert.showError(error);
                                _this.cleanCommon();
                            });
                        }
                        else {
                            _this.alert.showInvalidPasswordAlert();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    TransferPage.prototype.updateFees = function () {
        var _this = this;
        if (this.formData.isMosaicTransfer) {
            this.nem.prepareMosaicTransaction(this.common, this.formData).then(function (entity) {
                console.log(entity);
                _this.formData.innerFee = 0;
                _this.presentPrompt();
            });
        }
        else {
            var entity = this.nem.prepareTransaction(this.common, this.formData);
            this.formData.innerFee = 0;
            this.formData.fee = entity.fee;
            this.presentPrompt();
        }
    };
    TransferPage.prototype.startTransaction = function () {
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
    };
    TransferPage.prototype._subtitleBuilder = function () {
        var subtitle = 'You are going to send: <br/><br/> ';
        var currency = '';
        if (this.selectedMosaic == 'nem:xem') {
            currency = "<b>Amount:</b> " + this.amount + " nem:xem";
        }
        else {
            currency = "<b>Amount:</b> " + this.amount + " " + this.selectedMosaic;
        }
        subtitle += currency;
        var _fee = this.formData.fee / 1000000;
        subtitle += '<br/><br/>  <b>Fee:</b> ' + _fee + ' xem';
        return subtitle;
    };
    TransferPage.prototype.canSendTransaction = function () {
        return this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo);
    };
    TransferPage.prototype.confirmTransaction = function () {
        var _this = this;
        if (this.formData.isMosaicTransfer) {
            return this.nem.prepareMosaicTransaction(this.common, this.formData).then(function (entity) {
                return _this.nem.confirmTransaction(_this.common, entity);
            });
        }
        else {
            var entity = this.nem.prepareTransaction(this.common, this.formData);
            return this.nem.confirmTransaction(this.common, entity);
        }
    };
    TransferPage.prototype.scanQR = function () {
        var _this = this;
        this.barcodeScanner.scan().then(function (barcodeData) {
            var addresObject = JSON.parse(barcodeData.text);
            _this.formData.rawRecipient = addresObject.data.addr;
        }, function (err) {
            console.log("Error on scan");
        });
    };
    return TransferPage;
}());
TransferPage = __decorate([
    Component({
        selector: 'page-transfer',
        templateUrl: 'transfer.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams, NemProvider, AlertProvider, BarcodeScanner, AlertController])
], TransferPage);
export { TransferPage };
//# sourceMappingURL=transfer.js.map