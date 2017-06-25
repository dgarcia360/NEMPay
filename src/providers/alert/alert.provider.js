var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
/*
 Generated class for the Alert provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
var AlertProvider = (function () {
    function AlertProvider(alertCtrl) {
        this.alertCtrl = alertCtrl;
    }
    AlertProvider.prototype.showWalletNotSelectedAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Wallet not selected',
            subTitle: '',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    };
    AlertProvider.prototype.showInvalidPasswordAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Provided password or passphrase is invalid',
            subTitle: '',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    };
    AlertProvider.prototype.showPasswordDoNotMatch = function () {
        var alert = this.alertCtrl.create({
            title: 'Introduced Passwords or Passphrases are different',
            subTitle: '',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    };
    AlertProvider.prototype.showWalletNameAlreadyExists = function () {
        var alert = this.alertCtrl.create({
            title: 'Wallet Name already exists',
            subTitle: '',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    };
    AlertProvider.prototype.showAlertDoesNotBelongToNetwork = function () {
        var alert = this.alertCtrl.create({
            title: 'Address is not valid for this network',
            subTitle: 'Remember that at the moment only works on testnet',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    };
    AlertProvider.prototype.showError = function (error) {
        console.log(error);
        var alert = this.alertCtrl.create({
            title: error,
            buttons: ['OK']
        });
        alert.present();
        return alert;
    };
    return AlertProvider;
}());
AlertProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AlertController])
], AlertProvider);
export { AlertProvider };
//# sourceMappingURL=alert.provider.js.map