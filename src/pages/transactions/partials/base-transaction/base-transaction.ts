import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';

import {Address} from "nem-library";
@Component({
    selector: 'base-transaction',
    templateUrl: 'base-transaction.html'
})

export class BaseTransactionComponent {
    @Input() tx: any;
    @Input() address: Address;

    hasLevy:boolean;

    constructor(private nem: NemProvider) {
        this.hasLevy = false;
    }

    ngOnInit() {
        if (this.tx.mosaics){
            this.nem.addDefinitionToMosaics(this.tx.mosaics).subscribe(mosaics => {
                this.tx.mosaics = mosaics;
                this.hasLevy = this.nem.transactionHasAtLeastOneMosaicWithLevy(mosaics);
            });
        }
    }

}
