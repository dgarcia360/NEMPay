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
import {async, inject, TestBed} from '@angular/core/testing';
import {NemUtils} from './nem.utils';
import {Mosaic, MosaicId, NEMLibrary, NetworkTypes, XEM} from "nem-library";

describe('Provider: NemUtils', () => {

    beforeEach(async(() => {
        NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
        TestBed.configureTestingModule({

            declarations: [],
            providers: [NemUtils],
            imports: []

        }).compileComponents();

    }));

    afterEach(() => {
        NEMLibrary.reset();
    });


    it('isValidAddress', inject([NemUtils], (NemUtils) => {

        const correctAddress = "TDSFK5QOTO72WSSP2Z4VV72NMOOAGLSGHJ3ENOHB";
        expect(NemUtils.isValidAddress(correctAddress)).toBeTruthy();
        const incorrectNetwork = "NDSFK5QOTO72WSSP2Z4VV72NMOOAGLSGHJ3ENOHB";
        expect(NemUtils.isValidAddress(incorrectNetwork)).toBeFalsy();
        const incorrectAddress = "Address";
        expect(NemUtils.isValidAddress(incorrectAddress)).toBeFalsy();;

    }));

    it('getMosaicsDefinition', inject([NemUtils], (NemUtils) => {
        const xemMosaic =  new Mosaic(XEM.MOSAICID, 2000000000);
        const otherMosaic =  new Mosaic(new MosaicId('company', 'authenticity'), 100);
        NemUtils.getMosaicsDefinition([xemMosaic,otherMosaic])
            .subscribe(mosaics => {
                expect(mosaics[0].amount).toEqual(2000)
                expect(mosaics[1].amount).toEqual(100)
            });
    }));
});