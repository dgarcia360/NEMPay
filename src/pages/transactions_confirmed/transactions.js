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
import { NemProvider } from '../../providers/nem/nem.provider';
import { LoginPage } from '../login/login';
var TransactionsConfirmedPage = (function () {
    function TransactionsConfirmedPage(navCtrl, nem, loading) {
        this.navCtrl = navCtrl;
        this.nem = nem;
        this.loading = loading;
        this.transactions = [];
        this.address = '';
    }
    TransactionsConfirmedPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        var loader = this.loading.create({
            content: "Please wait..."
        });
        this.nem.getSelectedWallet().then(function (value) {
            _this.address = value.accounts[0].address;
            if (!value) {
                _this.navCtrl.push(LoginPage);
            }
            else {
                loader.present();
                _this.nem.getAllTransactionsFromAnAccount(_this.address).then(function (value) {
                    _this.transactions = value;
                    console.log(value);
                    loader.dismiss();
                });
            }
        });
    };
    return TransactionsConfirmedPage;
}());
TransactionsConfirmedPage = __decorate([
    Component({
        selector: 'page-transactions',
        templateUrl: 'transactions.html'
    }),
    __metadata("design:paramtypes", [NavController, NemProvider, LoadingController])
], TransactionsConfirmedPage);
export { TransactionsConfirmedPage };
//# sourceMappingURL=transactions.js.map