import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {Clipboard} from '@ionic-native/clipboard';
import {TranslateService} from '@ngx-translate/core';

import {ToastProvider} from '../../providers/toast/toast.provider';
import {ConfigProvider} from '../../providers/config/config.provider';
import {NemProvider} from '../../providers/nem/nem.provider';
import {LoginPage} from '../login/login';

@Component({
    selector: 'page-transactions',
    templateUrl: 'transactions.html'
})
export class TransactionsUnconfirmedPage {
    transactions: any;
    address: any;

    constructor(public navCtrl: NavController, private nem: NemProvider, private loading: LoadingController, private toast: ToastProvider, private clipboard: Clipboard, private config: ConfigProvider, public translate: TranslateService) {
        this.transactions = [];
        this.address = '';
    }

    ionViewWillEnter() {
        this.getTransactions(false);
    }

    /**
     * Retrieves current account unconfirmed transactions into this.transactions
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    public getTransactions(refresher) {
        let loader = this.loading.create({
            content: "Please wait..."
        });

        this.nem.getSelectedWallet().then(
            value => {
                this.address = value.accounts[0].address;
                if (!value) {
                    if (refresher) refresher.complete();
                    this.navCtrl.push(LoginPage);
                }
                else {
                    if (!refresher) loader.present();

                    this.nem.getUnconfirmedTransactionsFromAnAccount(this.address, this.config.defaultNetwork()).then(
                        value => {
                            if (refresher) refresher.complete();
                            else loader.dismiss();
                            this.transactions = value;
                        })
                }
            }
        )
    }

    /**
     * Copies into clipboard recipient or sender address
     * @param transaction  transaction object
     */
    public copyTransactionAddress(transaction) {
        var address;
        if (this.address == transaction.recipient) {
            address = this.nem.pubToAddress(transaction.signer, this.config.defaultNetwork());
        }
        else {
            address = transaction.recipient;
        }

        this.clipboard.copy(address).then(_ => {
            this.toast.showCopyCorrect();
        });
    }

}
