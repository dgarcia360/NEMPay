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
import {WalletProvider} from '../../../../providers/wallet/wallet.provider'
import {NemUtils} from '../../../../providers/nem/nem.utils';
import {Address, CosignatoryModification, MosaicTransferable, TransferTransaction} from "nem-library";

@Component({
    selector: 'multisig-transaction',
    templateUrl: 'multisig-transaction.html'
})

export class MultisigTransactionComponent {
    @Input() tx: any;

    private owner: Address;
    private amount: number;
    private mosaics: MosaicTransferable[];
    private hasLevy:boolean;
    private modifications: CosignatoryModification[];

    constructor(private wallet: WalletProvider, private nemUtils: NemUtils) {
        this.amount = 0;
        this.mosaics = [];
        this.hasLevy = false;
    }

    ngOnInit() {
        this.getMosaics();
        this.setOwner();
        this.getAmount();
        this.getCosignatoryModification();
    }

    private getAmount(){
        try {
            this.amount = (<TransferTransaction>this.tx.otherTransaction).xem().amount;
        }
        catch(e) {
            this.amount = 0;
        }
    }

    private getMosaics(){
        try {
            this.nemUtils.getMosaicsDefinition((<TransferTransaction>this.tx.otherTransaction).mosaics()).subscribe(mosaics => {
                this.mosaics = mosaics;
                this.hasLevy =  this.mosaics.filter(mosaic => mosaic.levy).length ? true : false;
            });
        }
        catch(e) {
            this.mosaics = [];
        }
    }

    private getCosignatoryModification(){
        try {
            this.modifications = this.tx.otherTransaction.modifications;
        }
        catch(e) {
            this.modifications = [];
        }
    }

    private setOwner(){
        this.owner = this.wallet.getSelectedWallet().address;
    }

}
