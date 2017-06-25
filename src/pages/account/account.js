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
import { NavController, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as kjua from "kjua";
import { NemProvider } from '../../providers/nem/nem.provider';
import { AlertProvider } from '../../providers/alert/alert.provider';
import { LoginPage } from "../login/login";
var AccountPage = (function () {
    function AccountPage(navCtrl, nem, socialSharing, loading, alert) {
        this.navCtrl = navCtrl;
        this.nem = nem;
        this.socialSharing = socialSharing;
        this.loading = loading;
        this.alert = alert;
        this.selectedWallet = { accounts: [{ 'address': '' }] };
        // Object to contain our password & private key data.
        this.common = {};
        this.cleanCommon();
        this.qrCode = { 'src': '' };
    }
    AccountPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.nem.getSelectedWallet().then(function (value) {
            if (!value) {
                _this.navCtrl.push(LoginPage);
            }
            else {
                _this.selectedWallet = value;
                var infoQR = JSON.stringify({
                    "v": -104,
                    "type": 1,
                    "data": {
                        "addr": _this.selectedWallet.accounts[0].address,
                        "name": _this.selectedWallet.name,
                    }
                });
                _this.encodeQrCode(infoQR);
            }
        });
    };
    AccountPage.prototype.encodeQrCode = function (text) {
        this.qrCode = kjua({
            size: 256,
            text: text,
            fill: '#000',
            quiet: 0,
            ratio: 2,
        });
    };
    AccountPage.prototype.shareAddress = function () {
        this.socialSharing.share(this.address, "My NEM Address").then(function () { });
    };
    AccountPage.prototype.showPrivateKey = function () {
        var _this = this;
        var loader = this.loading.create({
            content: "Please wait..."
        });
        loader.present().then(function (_) {
            if (!_this.nem.passwordToPrivateKey(_this.common, _this.selectedWallet.accounts[0], _this.selectedWallet.accounts[0].algo) || !_this.nem.checkAddress(_this.common.privateKey, _this.selectedWallet.accounts[0].network, _this.selectedWallet.accounts[0].address)) {
                loader.dismiss();
                _this.alert.showInvalidPasswordAlert();
            }
            else {
                loader.dismiss();
            }
        });
    };
    AccountPage.prototype.cleanCommon = function () {
        this.common = {
            'password': '',
            'privateKey': ''
        };
    };
    AccountPage.prototype.logout = function () {
        this.nem.unsetSelectedWallet();
        this.cleanCommon();
        this.navCtrl.push(LoginPage);
    };
    return AccountPage;
}());
AccountPage = __decorate([
    Component({
        selector: 'page-account',
        templateUrl: 'account.html'
    }),
    __metadata("design:paramtypes", [NavController, NemProvider, SocialSharing, LoadingController, AlertProvider])
], AccountPage);
export { AccountPage };
//# sourceMappingURL=account.js.map