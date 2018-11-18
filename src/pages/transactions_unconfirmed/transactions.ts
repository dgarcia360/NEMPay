/*
 * MIT License
 *
 * Copyright (c) 2017 David Garcia <dgarcia360@outlook.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {Component} from '@angular/core';
import {LoadingController, NavController, Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {LoginPage} from '../login/login';
import {Transaction, Wallet, TransactionTypes, AccountHttp} from 'nem-library';

@Component({
    selector: 'page-transactions',
    templateUrl: 'transactions.html'
})
export class TransactionsUnconfirmedPage {
    accountHttp: AccountHttp;
    transactions: Transaction[];
    selectedWallet: Wallet;
    TransactionTypes = TransactionTypes;
    constructor(private platform: Platform, public navCtrl: NavController, private wallet: WalletProvider,
                private loading: LoadingController, public translate: TranslateService) {
        this.accountHttp = new AccountHttp();
        this.transactions = [];
    }

    ionViewWillEnter() {
        this.selectedWallet = this.wallet.getSelectedWallet();
        if (!this.selectedWallet) {
            this.navCtrl.setRoot(LoginPage);
        } else {
            this.getTransactions(false);
        }
    }

    /**
     * Gets current account unconfirmed transactions into this.transactions
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    public getTransactions(refresher) {
        let loader;
        this.translate
            .get('PLEASE_WAIT', {})
            .mergeMap( res => {
                loader = this.loading.create({content: res});
                if (!refresher) {
                    loader.present();
                }
                return this.accountHttp.unconfirmedTransactions(this.selectedWallet.address);
            })
            .subscribe(transactions => {
                this.transactions = transactions;
                if (refresher) {
                    refresher.complete();
                } else {
                    loader.dismiss();
                }
            });
    }

}
