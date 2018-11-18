/*
 * MIT License
 *
 * Copyright (c) 2017 David Garcia <dgarcia360@outlook.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {Component, Input} from '@angular/core';
import {NemUtils} from '../../../../providers/nem/nem.utils';
import {WalletProvider} from '../../../../providers/wallet/wallet.provider'
import {Address, MosaicTransferable} from "nem-library";

@Component({
    selector: 'transfer-transaction',
    templateUrl: 'transfer-transaction.html'
})

export class TransferTransactionComponent {
    @Input() tx: any;

    private owner: Address;
    private amount: number;
    private mosaics: MosaicTransferable[];
    private hasLevy:boolean;

    constructor(private nemUtils: NemUtils, private wallet: WalletProvider) {
        this.hasLevy = false;
        this.amount = 0;
        this.mosaics = [];
    }

    ngOnInit() {
        this.getAmount();
        this.getMosaics();
        this.setOwner();
    }

    private getAmount(){

        try {
            this.amount = this.tx.xem().amount;
        }
        catch(e) {
            this.amount = 0;
        }
    }

    private getMosaics(){
        try {
            this.nemUtils.getMosaicsDefinition(this.tx.mosaics()).subscribe(mosaics => {
                this.mosaics = mosaics;
                this.hasLevy =  this.mosaics.filter(mosaic => mosaic.levy).length ? true : false;
            });
        }
        catch(e) {
            this.mosaics = [];
        }
    }

    private setOwner(){
        this.owner = this.wallet.getSelectedWallet().address;
    }

}
