//"type": 2049

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';

@Component({
    selector: 'importance-transfer-transaction',
    templateUrl: 'importance-transfer-transaction.html'
})

export class ImportanceTransferTransactionComponent {
    @Input() tx: any;


    constructor(private nem: NemProvider) {
    }

    ngOnInit(){

    }

}
