import {AbstractControl} from '@angular/forms';

export class PasswordValidation {

    static EqualPasswords(control: AbstractControl) {
        const password = control.get('password').value;
        const repeatPassword = control.get('repeatPassword').value;
        if(password == repeatPassword) {
            return null;
        } else {
            control.get('repeatPassword').setErrors( {mismatch: true} )
        }
    }
}