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
import {Injectable} from '@angular/core';

import {
    AccountHttp,
    AccountOwnedMosaicsService,
    Address,
    Mosaic,
    MosaicHttp,
    MosaicTransferable,
    NEMLibrary,
    QRService,
    TransactionHttp,
    XEM
} from "nem-library";

import {Observable} from "nem-library/node_modules/rxjs";

@Injectable()
export class NemUtils {
    accountHttp: AccountHttp;
    mosaicHttp: MosaicHttp;
    transactionHttp: TransactionHttp;
    qrService: QRService;
    accountOwnedMosaicsService: AccountOwnedMosaicsService;

    constructor() {
        this.accountHttp = new AccountHttp();
        this.mosaicHttp = new MosaicHttp();
        this.transactionHttp = new TransactionHttp();
        this.qrService = new QRService();
        this.accountOwnedMosaicsService = new AccountOwnedMosaicsService(this.accountHttp, this.mosaicHttp);
    }

    /**
     * Check if an addres is valid
     * @param address address to check
     * @return boolean
     */
    public isValidAddress(rawAddress: string): boolean {
        let valid = true;
        try {
            const address = new Address(rawAddress);
            if (address.network() != NEMLibrary.getNetworkType()) {
                valid = false;
            } else if (address.plain().length != 40){
                valid = false;
            }
        } catch (err) {
            valid = false;
        }
        return valid;
    }


    /**
     * Adds to a transaction data mosaic definitions
     * @param mosaics array of mosaics
     * @return Observable<MosaicTransferable[]>
     */
    public getMosaicsDefinition(mosaics: Mosaic[]): Observable<MosaicTransferable[]> {
        return Observable.from(mosaics)
            .flatMap((mosaic: Mosaic) => {
                if (XEM.MOSAICID.equals(mosaic.mosaicId)) {
                    return Observable.of(new XEM(mosaic.quantity / Math.pow(10, XEM.DIVISIBILITY)));
                } else {
                    return this.mosaicHttp
                        .getMosaicDefinition(mosaic.mosaicId)
                        .map(mosaicDefinition => {
                            return MosaicTransferable
                                .createWithMosaicDefinition(
                                    mosaicDefinition,
                                    mosaic.quantity / Math.pow(10, mosaicDefinition.properties.divisibility)
                                );
                        });
                }
            })
            .toArray();
    }
}
