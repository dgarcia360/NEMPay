import {Component} from '@angular/core';

import {MenuController, NavController, LoadingController, NavParams} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';

import {TransferPage} from '../transfer/transfer';
import {ReceivePage} from '../receive/receive';

import {LoginPage} from '../login/login';

import {Wallet, MosaicTransferable} from 'nem-library';

@Component({
    selector: 'page-balance',
    templateUrl: 'balance.html'
})
export class BalancePage {
    selectedWallet: Wallet;
    balance: MosaicTransferable[];
    selectedMosaic: MosaicTransferable;
    addressToSendAssets: string;

    constructor(public navCtrl: NavController, private nem: NemProvider, private navParams:NavParams, private wallet: WalletProvider, private menu: MenuController, public translate: TranslateService, private alert: AlertProvider, private loading: LoadingController) {
        this.addressToSendAssets = navParams.get('address') || null;
    }

    ionViewWillEnter() {
        if (!this.addressToSendAssets) this.menu.enable(true);

        this.wallet.getSelectedWallet().then(wallet => {
            if (!wallet) this.navCtrl.setRoot(LoginPage);
            else {
                this.selectedWallet = wallet;
                this.getBalance(false);
            }
        });
    }

    /**
     * Retrieves current account owned mosaics  into this.balance
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    public getBalance(refresher:any) {
        this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
            let loader = this.loading.create({
                content: res
            });

            if (!refresher) loader.present();

            this.nem.getBalance(this.selectedWallet.address).then(balance => {
                this.balance = balance;
                if (this.balance.length > 0) {
                    this.selectedMosaic = this.balance[0];
                }
                if (refresher) refresher.complete();
                else loader.dismiss();
            });
        });
    }

    /**
     * Moves to transfer, by default with mosaic selected
     */
    goToTransfer(){
        if(this.selectedMosaic.properties.transferable){
            this.navCtrl.push(TransferPage, {
                'selectedMosaic': this.selectedMosaic,
                'address': this.addressToSendAssets
            });
        }
        else this.alert.showMosaicNotTransferable();
    }

   /**
     * Moves to receive, by default with mosaic selected
     */
    goToReceive(){
        this.navCtrl.push(ReceivePage, {
            selectedMosaic: this.selectedMosaic
        });
    }

}
