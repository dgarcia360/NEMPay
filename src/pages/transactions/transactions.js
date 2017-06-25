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
import { NavController } from 'ionic-angular';
import { TransactionsConfirmedPage } from '../transactions_confirmed/transactions';
import { TransactionsUnconfirmedPage } from '../transactions_unconfirmed/transactions';
var TransactionsPage = (function () {
    function TransactionsPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.tab1Root = TransactionsConfirmedPage;
        this.tab2Root = TransactionsUnconfirmedPage;
    }
    return TransactionsPage;
}());
TransactionsPage = __decorate([
    Component({
        selector: 'page-transactions',
        templateUrl: 'transactions.html'
    }),
    __metadata("design:paramtypes", [NavController])
], TransactionsPage);
export { TransactionsPage };
//# sourceMappingURL=transactions.js.map