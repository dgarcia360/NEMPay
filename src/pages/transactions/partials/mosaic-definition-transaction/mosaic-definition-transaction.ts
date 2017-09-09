//"type": 16385

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';

import {Address} from "nem-library";
@Component({
    selector: 'mosaic-definition-transaction',
    templateUrl: 'mosaic-definition-transaction.html'
})

export class MosaicDefinitionTransactionComponent {
    @Input() tx: any;


    constructor(private nem: NemProvider) {
    }

    ngOnInit(){

    }

}
