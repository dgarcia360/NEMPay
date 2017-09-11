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
        this.translate.get(['ALERT_NOT_WALLET_SELECTED', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_NOT_WALLET_SELECTED'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showInvalidPasswordAlert() {

        this.translate.get(['ALERT_PROVIDED_PASSWORD_INVALID', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_PROVIDED_PASSWORD_INVALID'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }


    showPasswordDoNotMatch() {
        this.translate.get(['ALERT_PASSWORDS_DO_NOT_MATCH', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_PASSWORDS_DO_NOT_MATCH'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showWalletNameAlreadyExists() {
        this.translate.get(['ALERT_WALLET_NAME_ALREADY_EXISTS', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_WALLET_NAME_ALREADY_EXISTS'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showAlertDoesNotBelongToNetwork() {

        this.translate.get(['ALERT_WALLET_IS_NOT_INVALID_FOR_THIS_NETWORK', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_WALLET_IS_NOT_INVALID_FOR_THIS_NETWORK'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showTransactionConfirmed() {

        this.translate.get(['ALERT_TRANSACTION_CONFIRMED', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_TRANSACTION_CONFIRMED'],
                buttons: [res['OK']]
            });

            alert.present();
        });

    }

    showDoesNotHaveEnoughFunds() {

        this.translate.get(['ALERT_ACCOUNT_DOES_NOT_HAVE_ENOUGH_FUNDS', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_ACCOUNT_DOES_NOT_HAVE_ENOUGH_FUNDS'],
                buttons: [res['OK']]
            });

            alert.present();
        });

    }

    showMessageTooLarge() {
        this.translate.get(['ALERT_SHOW_ATTACHED_MESSAGE_IS_TOO_LARGE', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_SHOW_ATTACHED_MESSAGE_IS_TOO_LARGE'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showMosaicNotTransferable() {
        this.translate.get(['ALERT_MOSAIC_IS_NOT_TRANSFERABLE', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_MOSAIC_IS_NOT_TRANSFERABLE'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showBarCodeScannerRequiresPassword() {
        this.translate.get(['IMPORT_ACCOUNT_QR_WARNING', 'OK'], {}).subscribe((res) => {

            let alert = this.alertCtrl.create({
                title: res['IMPORT_ACCOUNT_QR_WARNING'],
                buttons: [res['OK']]
            });
            alert.present();
        });

    }


    showInvalidPrivateKey() {
        this.translate.get(['ALERT_INVALID_PRIVATE_KEY', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_INVALID_PRIVATE_KEY'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showWeakPassword() {
        this.translate.get(['ALERT_WEAK_PASSWORD', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_WEAK_PASSWORD'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

     showFunctionallityOnlyAvailableInMobileDevices() {
        this.translate.get(['ALERT_ONLY_MOBILE_DEVICE', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_ONLY_MOBILE_DEVICE'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }

    showContactAlreadyExists() {
        this.translate.get(['ALERT_CONTACT_ALREADY_EXISTS', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_CONTACT_ALREADY_EXISTS'],
                buttons: [res['OK']]
            });

            alert.present();
        });
    }



    showOnPhoneDisconnected() {
        this.translate.get(['ALERT_PHONE_DISCONNECTED', 'ALERT_SUBTITLE_PHONE_DISCONNECTED', 'OK'], {}).subscribe((res) => {
            let alert = this.alertCtrl.create({
                title: res['ALERT_PHONE_DISCONNECTED'],
                subTitle: res['ALERT_SUBTITLE_PHONE_DISCONNECTED'],
                buttons: [res['OK']]
            });
            alert.present();
        });
    }


    showError(error) {
        this.translate.get('OK', {}).subscribe((res) => {

            let alert = this.alertCtrl.create({
                title: error,
                buttons: [res]
            });
            alert.present();
        });

    }
}