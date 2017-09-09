import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {Clipboard} from '@ionic-native/clipboard';
import {TranslateService} from '@ngx-translate/core';

import {ToastProvider} from '../../providers/toast/toast.provider';
import {NemProvider} from '../../providers/nem/nem.provider';

import {LoginPage} from '../login/login';

import {Address, Transaction, TransferTransaction} from 'nem-library';
import {TransactionTypes} from "nem-library/dist/src/models/transaction/TransactionTypes";

@Component({
    selector: 'page-transactions',
    templateUrl: 'transactions.html'
})
export class TransactionsUnconfirmedPage {
    transactions: Transaction[];
    address: Address;
    TransactionTypes = TransactionTypes;

    constructor(public navCtrl: NavController, private nem: NemProvider, private loading: LoadingController, private toast: ToastProvider, private clipboard: Clipboard, public translate: TranslateService) {
        this.transactions = [];
    }

    ionViewWillEnter() {
        this.getTransactions(false);
    }

    /**
     * Retrieves current account unconfirmed transactions into this.transactions
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    public getTransactions(refresher) {
        this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
            let loader = this.loading.create({
                content: res
            });
            this.nem.getSelectedWallet().then(
                wallet => {
                    this.address = wallet.address;
                    if (!wallet) {
                        if (refresher) refresher.complete();
                        this.navCtrl.push(LoginPage);
                    }
                    else {
                        if (!refresher) loader.present();

                        this.nem.getUnconfirmedTransactionsFromAnAccount(this.address)
                            .flatMap(_ => _)
                            .toArray()
                            .subscribe(
                                transactions => {
                                    if (refresher) refresher.complete();
                                    else loader.dismiss();
                                    this.transactions = transactions;
                                });
                    }
                });
        });
    }

    /**
     * Copies into clipboard recipient or sender address
     * @param transaction  transaction object
     */
    public copyTransactionAddress(transaction: TransferTransaction) {
        var copiableAddress = "";
        if (this.address.plain() == transaction.recipient.plain()) {
            copiableAddress = transaction.signer.address.plain();
        }
        else {
            copiableAddress = transaction.recipient.plain();
        }
        this.clipboard.copy(copiableAddress).then(_ => {
            this.toast.showCopyCorrect();
        });
    }

}
