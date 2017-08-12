import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';
import {ConfigProvider} from '../../../../providers/config/config.provider';

@Component({
    selector: 'base-transaction',
    templateUrl: 'base-transaction.html'
})

export class BaseTransactionComponent {
    @Input() tx;
    @Input() address;

    hasLevy:boolean;

    constructor(private nem: NemProvider, private  config: ConfigProvider) {
        this.hasLevy = false;
    }

    ngOnInit() {
        if (this.tx.transaction.mosaics){

            this.nem.addDefinitionToMosaics(this.tx.transaction.mosaics, this.config.defaultNetwork()).then(mosaics => {
                this.tx.transaction.mosaics = mosaics;
                this.hasLevy = this.nem.transactionHasAtLeastOneMosaicWithLevy(mosaics);
            });
        }
    }

}
