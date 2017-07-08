import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the Alert provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class AlertProvider {

    constructor(private alertCtrl: AlertController) {

    }

    showWalletNotSelectedAlert() {
        let alert = this.alertCtrl.create({
            title: 'Wallet not selected',
            subTitle: '',
            buttons: ['OK']
        });

        alert.present()
        return alert;
    }

    showInvalidPasswordAlert() {
        let alert = this.alertCtrl.create({
            title: 'Provided password is invalid',
            subTitle: '',
            buttons: ['OK']
        });
        alert.present()
        return alert;
    }

    showPasswordDoNotMatch() {
        let alert = this.alertCtrl.create({
            title: 'Introduced Passwords are different',
            subTitle: '',
            buttons: ['OK']
        });

        alert.present()
        return alert;
    }

    showWalletNameAlreadyExists() {
        let alert = this.alertCtrl.create({
            title: 'Wallet Name already exists',
            subTitle: '',
            buttons: ['OK']
        });

        alert.present()
        return alert;
    }

    showAlertDoesNotBelongToNetwork() {
        let alert = this.alertCtrl.create({
            title: 'Address is not valid for this network',
            subTitle: 'Remember that at the moment only works on testnet',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }

    showTransactionConfirmed() {
        let alert = this.alertCtrl.create({
            title: 'Transaction successfully sent',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }

    showDoesNotHaveEnoughFunds() {
        let alert = this.alertCtrl.create({
            title: 'Your account has insufficient funds',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }

    showMessageTooLarge() {
        let alert = this.alertCtrl.create({
            title: 'Attached message is too large.',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }

    showMosaicNotTransferable() {
        let alert = this.alertCtrl.create({
            title: 'Selected Mosaic It is not transferable',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }

    showBarCodeScannerRequiresPassword() {
        let alert = this.alertCtrl.create({
            title: 'To use QR wallet scanner, you must use the same password as your current wallet account',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }


    showInvalidPrivateKey() {
        let alert = this.alertCtrl.create({
            title: 'Invalid Private Key',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }

    showError(error) {
        let alert = this.alertCtrl.create({
            title: error,
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }

}
