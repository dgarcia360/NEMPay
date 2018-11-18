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
import {NemValidator} from './nem.validator';
import {NEMLibrary, NetworkTypes} from "nem-library";
import {FormControl} from "@angular/forms";

describe('Validator: Nem', () => {

    beforeEach(async(() => {
        NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
        TestBed.configureTestingModule({

            declarations: [],
            providers: [],
            imports: []

        }).compileComponents();

    }));

    afterEach(() => {
        NEMLibrary.reset();
    });


    it('isValidAddress', inject([], () => {
        const addressControl = new FormControl();
        addressControl.patchValue("TDSFK5QOTO72WSSP2Z4VV72NMOOAGLSGHJ3ENOHB");
        expect(NemValidator.isValidAddress(addressControl)).toBeNull();

        addressControl.patchValue("Address");
        expect(NemValidator.isValidAddress(addressControl)).toEqual({ invalidAddress: true });

    }));


    it('isValidTransferAmount', inject([], () => {
        const amountControl = new FormControl();
        amountControl.patchValue(5);
        expect(NemValidator.isValidTransferAmount(amountControl)).toBeNull();

        amountControl.patchValue(-1);
        expect(NemValidator.isValidTransferAmount(amountControl)).toEqual({ invalidTransferAmount: true });

    }));


    it('isValidPrivateKey', inject([], () => {
        const privateKeyControl = new FormControl();
        privateKeyControl.patchValue("aaaaaaaaaaeeeeeeeeeebbbbbbbbbb5555555555dddddddddd1111111111aaee");
        expect(NemValidator.isValidPrivateKey(privateKeyControl)).toBeNull();

        privateKeyControl.patchValue("aaaaaaa");
        expect(NemValidator.isValidPrivateKey(privateKeyControl)).toEqual({ invalidPrivateKey: true });

    }));
});