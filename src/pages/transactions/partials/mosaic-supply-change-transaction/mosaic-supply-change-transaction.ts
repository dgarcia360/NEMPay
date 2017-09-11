//"type": 16386

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';

@Component({
    selector: 'mosaic-supply-change-transaction',
    templateUrl: 'mosaic-supply-change-transaction.html'
})

export class MosaicSupplyChangeTransactionComponent {
    @Input() tx: any;


    constructor(private nem: NemProvider) {
    }

    ngOnInit(){

    }

}
