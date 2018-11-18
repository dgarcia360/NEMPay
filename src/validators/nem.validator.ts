import { AbstractControl } from '@angular/forms';
import {NemUtils} from "../providers/nem/nem.utils";

export class NemValidator {

    static isValidAddress(control: AbstractControl): any {
        const nemUtils = new NemUtils();
        if (!nemUtils.isValidAddress(control.value)){
            return { invalidAddress: true };
        }
        return null;
    }

    static isValidTransferAmount(control:AbstractControl): any{
        if (control.value < 0 || control.value >= 9000000000) {
            return { invalidTransferAmount: true };
        }
        return null;
    }

    static isValidPrivateKey(control:AbstractControl): any{
        if (control.value.length == 64 || control.value.length == 66) {
            return null;
        }
        return { invalidPrivateKey: true };
    }


}