//"type": 4100

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';

import {Address, TransferTransaction} from "nem-library";
@Component({
    selector: 'multisig-transaction',
    templateUrl: 'multisig-transaction.html'
})

export class MultisigTransactionComponent {
    @Input() tx: any;
    @Input() address: Address;

    hasLevy:boolean;

    constructor(private nem: NemProvider) {
        this.hasLevy = false;
    }

    ngOnInit() {
        if ((<TransferTransaction>this.tx.otherTransaction).mosaics) {
            this.nem.addDefinitionToMosaics(this.tx.otherTransaction.mosaics).subscribe(mosaics => {                
                this.tx.otherTransaction.mosaics = mosaics;
                this.hasLevy = this.nem.transactionHasAtLeastOneMosaicWithLevy(mosaics);
            });
        }

    }
}
