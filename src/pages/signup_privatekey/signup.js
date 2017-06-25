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
import { App, LoadingController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem.provider';
import { AlertProvider } from '../../providers/alert/alert.provider';
import { LoginPage } from '../login/login';
var SignupPrivateKeyPage = (function () {
    function SignupPrivateKeyPage(app, nem, loading, alert) {
        this.app = app;
        this.nem = nem;
        this.loading = loading;
        this.alert = alert;
        this.newAccount = {
            'name': '',
            'passphrase': '',
            'private_key': '',
            'repeat_passphrase': ''
        };
    }
    SignupPrivateKeyPage.prototype.createPrivateKeyWallet = function () {
        var _this = this;
        if (this.newAccount.passphrase != this.newAccount.repeat_passphrase) {
            this.alert.showPasswordDoNotMatch();
        }
        else {
            var loader_1 = this.loading.create({
                content: "Please wait..."
            });
            loader_1.present().then(function (_) {
                _this.nem.createPrivateKeyWallet(_this.newAccount.name, _this.newAccount.passphrase, _this.newAccount.private_key, -104).then(function (value) {
                    if (value) {
                        loader_1.dismiss();
                        _this.app.getRootNav().push(LoginPage);
                    }
                    else {
                        loader_1.dismiss();
                        _this.alert.showWalletNameAlreadyExists();
                    }
                });
            });
        }
    };
    return SignupPrivateKeyPage;
}());
SignupPrivateKeyPage = __decorate([
    Component({
        selector: 'page-signup-privatekey',
        templateUrl: 'signup.html'
    }),
    __metadata("design:paramtypes", [App, NemProvider, LoadingController, AlertProvider])
], SignupPrivateKeyPage);
export { SignupPrivateKeyPage };
//# sourceMappingURL=signup.js.map