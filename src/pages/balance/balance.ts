import {Component} from '@angular/core';

import {MenuController, NavController, LoadingController} from 'ionic-angular';

import {ConfigProvider} from '../../providers/config/config.provider';
import {NemProvider} from '../../providers/nem/nem.provider';

import {TransferPage} from '../transfer/transfer';
import {LoginPage} from '../login/login';

@Component({
    selector: 'page-balance',
    templateUrl: 'balance.html'
})
export class BalancePage {
    selectedWallet: any;
    balance: any;
    selectedMosaic: any;

    constructor(public navCtrl: NavController, private nem: NemProvider, private loading: LoadingController, private menu: MenuController, private config: ConfigProvider) {

    }


    ionViewWillEnter() {
        this.getBalance(false);
    }

    /**
     * Retrieves current account owned mosaics  into this.balance
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    getBalance(refresher) {
        this.menu.enable(true);
        var loader = null;

        if (!refresher){
            loader = this.loading.create({
                content: "Please wait..."
            });
        }

        this.nem.getSelectedWallet().then(
            value => {
                if (!value) {
                    if (refresher) refresher.complete();
                    this.navCtrl.setRoot(LoginPage);
                }
                else {
                    if (!refresher) {
                        loader.present();
                    }
                    this.nem.getBalance(value.accounts[0].address, this.config.defaultNetwork()).then(
                        value => {

                            if (refresher) {
                                refresher.complete();
                            }
                            else{
                                loader.dismiss();
                            }
                            this.balance = value.data;

                        })
                }
            }
        )
    }

    /**
     * Moves to transfer, by default with mosaic selected
     */
    goToTransfer() {
        this.navCtrl.push(TransferPage, {
            selectedMosaic: this.selectedMosaic.mosaicId.namespaceId + ':' + this.selectedMosaic.mosaicId.name,
            quantity: this.selectedMosaic.quantity,
        });
    }
}
