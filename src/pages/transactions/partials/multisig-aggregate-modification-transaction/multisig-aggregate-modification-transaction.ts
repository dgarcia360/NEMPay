//"type": 4700

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';

@Component({
    selector: 'multisig-aggregate-modification-transaction',
    templateUrl: 'multisig-aggregate-modification-transaction.html'
})

export class MultisigAggregateModificationTransactionComponent {
    @Input() tx: any;


    constructor(private nem: NemProvider) {
    }

    ngOnInit(){

    }

}
