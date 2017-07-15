import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the Alert provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class AlertProvider {

    constructor(private alertCtrl: AlertController, private translate: TranslateService) {

    }

    showWalletNotSelectedAlert() {
        return this.translate.get('ALERT_NOT_WALLET_SELECTED', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
    }

    showInvalidPasswordAlert() {
        return this.translate.get('ALERT_PROVIDED_PASSWORD_INVALID', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
    }

    showPasswordDoNotMatch() {
        return this.translate.get('ALERT_PASSWORDS_DO_NOT_MATCH', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
    }

    showWalletNameAlreadyExists() {
        return this.translate.get('ALERT_WALLET_NAME_ALREADY_EXISTS', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
    }

    showAlertDoesNotBelongToNetwork() {

        return this.translate.get('ALERT_WALLET_IS_NOT_INVALID_FOR_THIS_NETWORK', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
    }

    showTransactionConfirmed() {

        return this.translate.get('ALERT_TRANSACTION_CONFIRMED', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });

    }

    showDoesNotHaveEnoughFunds() {

        return this.translate.get('ALERT_ACCOUNT_DOES_NOT_HAVE_ENOUGH_FUNDS', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });

    }

    showMessageTooLarge() {
        return this.translate.get('ALERT_SHOW_ATTACHED_MESSAGE_IS_TOO_LARGE', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
    }

    showMosaicNotTransferable() {
        return this.translate.get('ALERT_MOSAIC_IS_NOT_TRANSFERABLE', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
    }

    showBarCodeScannerRequiresPassword() {
        //TODO: ADD it in i18n
        let alert = this.alertCtrl.create({
            title: 'To use QR wallet scanner, you must use the same password as your current wallet account',
            buttons: ['OK']
        });
        alert.present();
        return alert;
    }


    showInvalidPrivateKey() {
        return this.translate.get('ALERT_INVALID_PRIVATE_KEY', {}).subscribe((res: string) => {
            let alert = this.alertCtrl.create({
                title: res,
                buttons: ['OK']
            });

            alert.present();
            return alert;
        });
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
