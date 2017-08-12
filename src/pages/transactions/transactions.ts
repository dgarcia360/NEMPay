import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TransactionsConfirmedPage} from '../transactions_confirmed/transactions';
import {TransactionsUnconfirmedPage} from '../transactions_unconfirmed/transactions';

@Component({
    selector: 'page-transactions',
    templateUrl: 'transactions.html'
})
export class TransactionsPage {

    tab1Root = TransactionsConfirmedPage;
    tab2Root = TransactionsUnconfirmedPage;

    constructor(public navCtrl: NavController) {

    }
}
