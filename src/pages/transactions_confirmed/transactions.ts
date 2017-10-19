import {Component} from '@angular/core';
import {NavController, LoadingController, Platform} from 'ionic-angular';
import {Clipboard} from '@ionic-native/clipboard';
import {TranslateService} from '@ngx-translate/core';

import {ToastProvider} from '../../providers/toast/toast.provider';
import {NemProvider} from '../../providers/nem/nem.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';


import {LoginPage} from '../login/login';

import {Wallet, Transaction, TransferTransaction}  from 'nem-library';
import {TransactionTypes} from "nem-library/dist/src/models/transaction/TransactionTypes";

@Component({
    selector: 'page-transactions',
    templateUrl: 'transactions.html'
})
export class TransactionsConfirmedPage {
    transactions: Transaction[];
    selectedWallet: Wallet;
    TransactionTypes = TransactionTypes;

    constructor(private platform: Platform, public navCtrl: NavController, private nem: NemProvider, private wallet: WalletProvider, private loading: LoadingController, private toast: ToastProvider, private clipboard: Clipboard, public translate: TranslateService, private alert: AlertProvider) {
        this.transactions = [];
    }

    ionViewWillEnter() {
        this.wallet.getSelectedWallet().then(
            wallet => {
                if (!wallet) {
                    this.navCtrl.push(LoginPage);
                }
                else {
                    this.selectedWallet = wallet;
                    this.getTransactions(false);
                }
            })
    }

    /**
     * Retrieves current account confirmed transactions into this.transactions
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    public getTransactions(refresher) {

        this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
            let loader = this.loading.create({
                content: res
            });


            if (!refresher) loader.present();
            this.nem.getAllTransactionsFromAnAccount(this.selectedWallet.address)
            .flatMap(_ => _)
            .toArray()
            .subscribe(
                transactions => {
                    console.log(transactions);
                    if (refresher) refresher.complete();
                    else loader.dismiss();
                    this.transactions = transactions;
                })
        })
    }

    /**
     * Copies into clipboard recipient or sender address
     * @param transaction  transaction object
     */
    public copyTransactionAddress(transaction: TransferTransaction) {

        if (this.platform.is('cordova')) {
            let copiableAddress = "";
            if (this.selectedWallet.address && transaction.recipient && transaction.signer) {
                if (this.selectedWallet.address.plain() == transaction.recipient.plain()) {
                    copiableAddress = transaction.signer.address.plain();
                }
                else {
                    copiableAddress = transaction.recipient.plain();
                }
                this.clipboard.copy(copiableAddress).then(_ => {
                    this.toast.showAddressCopyCorrect();
                });
            }
        }

        else {
            this.alert.showFunctionallityOnlyAvailableInMobileDevices();
        }
    }
}
