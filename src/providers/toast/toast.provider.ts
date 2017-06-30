import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the Alert provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class ToastProvider {

    constructor(private toast: ToastController) {

    }

    showTransactionConfirmed() {
        let toast = this.toast.create({
            message: 'Transaction successfully sent',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
        return toast;
    }

    showCopyCorrect() {
        let toast = this.toast.create({
            message: 'Transaction displayed address has been copied',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
        return toast;
    }

}
