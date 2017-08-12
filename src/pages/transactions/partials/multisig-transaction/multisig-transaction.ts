import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';
import {ConfigProvider} from '../../../../providers/config/config.provider';

@Component({
    selector: 'multisig-transaction',
    templateUrl: 'multisig-transaction.html'
})

export class MultisigTransactionComponent {
    @Input() tx;
    @Input() address;

    hasLevy:boolean;

    constructor(private nem: NemProvider, private  config: ConfigProvider) {
        this.hasLevy = false;
    }

    ngOnInit() {

        if (this.tx.transaction.otherTrans.mosaics) {

            this.nem.addDefinitionToMosaics(this.tx.transaction.otherTrans.mosaics, this.config.defaultNetwork()).then(mosaics => {
                this.tx.transaction.otherTrans.mosaics = mosaics;
                this.hasLevy = this.nem.transactionHasAtLeastOneMosaicWithLevy(mosaics);
            });
        }

    }
}
