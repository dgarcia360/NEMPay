import {Component} from '@angular/core';

import {MenuController, NavController, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';

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

    constructor(public navCtrl: NavController, private nem: NemProvider, private menu: MenuController, public translate: TranslateService, private alert: AlertProvider, private loading: LoadingController) {

    }

    ionViewWillEnter() {
        this.menu.enable(true);
        this.getBalance(false);
    }

    /**
     * Retrieves current account owned mosaics  into this.balance
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    public getBalance(refresher) {
        this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
            let loader = this.loading.create({
                content: res
            });


            this.nem.getSelectedWallet().then(
                wallet => {

                    if (!wallet) {
                        if (refresher) refresher.complete();
                        this.navCtrl.setRoot(LoginPage);
                    }
                    else {

                        if (!refresher) loader.present();

                        this.nem.getBalance(wallet.address).then(
                            balance => {
                                this.balance = balance;
                                console.log(this.balance);
                                if (refresher) {
                                    refresher.complete();
                                }
                                else {
                                    loader.dismiss();
                                }
                            });
                    }
                }
            )
        });
    }

    /**
     * Check If Selected Mosaic is Transferable
     * @param mosaic  Mosaic object to be checked if is transferable

     */
    private _checkIfSelectedMosaicIsTransferable(mosaic){
        let isTransferable = (mosaic.definition.properties[3].value == 'true');
        return isTransferable;

    }

    /**
     * Moves to transfer, by default with mosaic selected
     */
    goToTransfer(){
        if(this._checkIfSelectedMosaicIsTransferable(this.selectedMosaic)){
            this.navCtrl.push(TransferPage, {
                selectedMosaic: this.selectedMosaic.mosaicId.namespaceId + ':' + this.selectedMosaic.mosaicId.name,
                quantity: this.selectedMosaic.quantity,
            });
        }
        else{
            this.alert.showMosaicNotTransferable();
        }

    }
}
