import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {Clipboard} from '@ionic-native/clipboard';
import {TranslateService} from '@ngx-translate/core';

import {ConfigProvider} from '../../providers/config/config.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';
import {NemProvider} from '../../providers/nem/nem.provider';

import {LoginPage} from '../login/login';

@Component({
    selector: 'page-transactions',
    templateUrl: 'transactions.html'
})
export class TransactionsConfirmedPage {
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
     * Retrieves current account confirmed transactions into this.transactions
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
                        this.nem.getAllTransactionsFromAnAccount(this.address, this.config.defaultNetwork()).then(
                            value => {
                                if (refresher) refresher.complete();
                                else loader.dismiss();
                                this.transactions = value;
                                console.log(this.transactions);

                            })
                    }
                }
            )
        });
    }

    /**
     * Copies into clipboard recipient or sender address
     * @param transaction  transaction object
     */
    public copyTransactionAddress(transaction) {
        var copiableAddress = "";
        if (this.address == transaction.recipient) {
            copiableAddress = this.nem.pubToAddress(transaction.signer, this.config.defaultNetwork());
        }
        else {
            copiableAddress = transaction.recipient;
        }
        this.clipboard.copy(copiableAddress).then(_ => {
            this.toast.showCopyCorrect();
        });
    }

}
