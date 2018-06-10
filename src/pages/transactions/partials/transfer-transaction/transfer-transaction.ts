//"type": 257

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';
import {WalletProvider} from '../../../../providers/wallet/wallet.provider'

import {Address, MosaicTransferable} from "nem-library";
@Component({
    selector: 'transfer-transaction',
    templateUrl: 'transfer-transaction.html'
})

export class TransferTransactionComponent {
    @Input() tx: any;

    owner: Address;
    amount: number;
    mosaics: MosaicTransferable[];
    hasLevy:boolean;


    private _getAmount(){

        try {
            this.amount = this.tx.xem().amount;
        }
        catch(e) {
            this.amount = 0;
        }
    }

    private _getMosaics(){
        try {
            this.nem.getMosaicsDefinition(this.tx.mosaics()).subscribe(mosaics => {
                this.mosaics = mosaics;
                this.hasLevy =  this.mosaics.filter(mosaic => mosaic.levy).length ? true : false;
            });
        }
        catch(e) {
            this.mosaics = [];
        }
    }

    private _setOwner(){
        this.wallet.getSelectedWallet().then(wallet =>{
            this.owner = wallet.address;
        })
    }

    constructor(private nem: NemProvider, private wallet: WalletProvider) {
        this.hasLevy = false;
        this.amount = 0;
        this.mosaics = [];
    }

    ngOnInit() {
        this._getAmount();
        this._getMosaics();
        this._setOwner();
    }

}
