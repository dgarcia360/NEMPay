//"type": 257

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';
import {WalletProvider} from '../../../../providers/wallet/wallet.provider'

import {Address} from "nem-library";
@Component({
    selector: 'transfer-transaction',
    templateUrl: 'transfer-transaction.html'
})

export class TransferTransactionComponent {
    @Input() tx: any;

    hasLevy:boolean;
    owner: Address;

    constructor(private nem: NemProvider, private wallet: WalletProvider) {
        this.hasLevy = false;
    }

    private _populateMosaicsWithDefinitionData(){
        if (this.tx.mosaics){
            this.nem.addDefinitionToMosaics(this.tx.mosaics).subscribe(mosaics => {
                this.tx.mosaics = mosaics;
                this.hasLevy = this.nem.transactionHasAtLeastOneMosaicWithLevy(mosaics);
            });
        }
    }

    private _setOwner(){
        this.wallet.getSelectedWallet().then(wallet =>{
            this.owner = wallet.address;
        })
    }

    ngOnInit() {
        this._populateMosaicsWithDefinitionData();
        this._setOwner();
    }

}
