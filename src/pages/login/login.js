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
import { MenuController, NavController, LoadingController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem.provider';
import { AlertProvider } from '../../providers/alert/alert.provider';
import { BalancePage } from '../balance/balance';
import { SignupPage } from '../signup/signup';
var LoginPage = (function () {
    function LoginPage(navCtrl, nem, alert, loading, menu) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.nem = nem;
        this.alert = alert;
        this.loading = loading;
        this.menu = menu;
        this.wallets = [];
        this.selectedWallet = null;
        // Object to contain our password & private key data.
        this.common = {
            'password': '',
            'privateKey': ''
        };
        this.nem.getWallets().then(function (value) {
            _this.wallets = value;
        });
    }
    LoginPage.prototype.ionViewWillEnter = function () {
        // the left menu should be disabled on the login page
        this.menu.enable(false);
    };
    LoginPage.prototype.ionViewWillLeave = function () {
        // enable the left menu when leaving the login page
        this.menu.enable(true);
    };
    LoginPage.prototype.compareFn = function (e1, e2) {
        return e1 && e2 ? e1.name === e2.name : e1 === e2;
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        var loader = this.loading.create({
            content: "Please wait..."
        });
        loader.present().then(function (_) {
            if (!_this.selectedWallet) {
                loader.dismiss();
                _this.alert.showWalletNotSelectedAlert();
            }
            // Decrypt/generate private key and check it. Returned private key is contained into this.common
            if (!_this.nem.passwordToPrivateKey(_this.common, _this.selectedWallet.accounts[0], _this.selectedWallet.accounts[0].algo) || !_this.nem.checkAddress(_this.common.privateKey, _this.selectedWallet.accounts[0].network, _this.selectedWallet.accounts[0].address)) {
                loader.dismiss();
                _this.alert.showInvalidPasswordAlert();
            }
            else {
                _this.nem.setSelectedWallet(_this.selectedWallet);
                loader.dismiss();
                _this.navCtrl.push(BalancePage);
            }
        });
    };
    LoginPage.prototype.goToSignup = function (params) {
        if (!params)
            params = {};
        this.navCtrl.push(SignupPage);
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Component({
        selector: 'page-login',
        templateUrl: 'login.html'
    }),
    __metadata("design:paramtypes", [NavController, NemProvider, AlertProvider, LoadingController, MenuController])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.js.map