//type: 8193

import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {NemProvider} from '../../../../providers/nem/nem.provider';

@Component({
    selector: 'provision-namespace-transaction',
    templateUrl: 'provision-namespace-transaction.html'
})

export class ProvisionNamespaceTransactionComponent {
    @Input() tx: any;

    constructor(private nem: NemProvider) {
    }

    ngOnInit() {

    }

}
