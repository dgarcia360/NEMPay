import {Component} from '@angular/core';
import {NavController, Platform, LoadingController} from 'ionic-angular';
import {Subscription} from 'rxjs';

import {SocialSharing} from '@ionic-native/social-sharing';
import {Clipboard} from '@ionic-native/clipboard';

import {TranslateService} from '@ngx-translate/core';

import * as kjua from "kjua";

import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';
import {WalletProvider} from '../../providers/wallet/wallet.provider';
import {ToastProvider} from '../../providers/toast/toast.provider';


import {LoginPage} from "../login/login";

import {SimpleWallet} from "nem-library";

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})

export class AccountPage {
    common: any;
    selectedWallet: SimpleWallet;
    qrCode: any;
    private onResumeSubscription: Subscription;

    constructor(public navCtrl: NavController, private nem: NemProvider, private wallet: WalletProvider, private socialSharing: SocialSharing, private loading: LoadingController, private alert: AlertProvider, private platform: Platform, public translate: TranslateService, private toast: ToastProvider, private clipboard: Clipboard) {
        //Stores sensitive data.
        this.common = {};

        //Initialize common
        this._clearCommon();

        this.qrCode = {'src': ''};

        //clear common if app paused
        this.onResumeSubscription = platform.resume.subscribe(() => {
            this._clearCommon();
        });

    }

    /**
     * Init view with QR and current wallet info
     * @param transaction  transaction object
     */
    ionViewWillEnter() {
        this.wallet.getSelectedWallet().then(
            value => {
                if (!value) this.navCtrl.setRoot(LoginPage);
                else {
                    this.selectedWallet = value;
                    let infoQR = this.nem.generateAddressQRText(this.selectedWallet.address);
                    this._encodeQrCode(infoQR);
                }
            }
        )
    }

    /**
     * Clears sensitive data
     */
    private _clearCommon() {
        this.common = {
            'password': '',
            'privateKey': ''
        };
    }

    /**
     * Encodes infoQR json into an image
     * @param infoQR  Object containing account information
     */
    private _encodeQrCode(infoQR) {
        this.qrCode = kjua({
            size: 256,
            text: infoQR,
            fill: '#000',
            quiet: 0,
            ratio: 2,
        });
    }

    /**
     * Determines if private key can be shown, if it is correct
     * @param transaction  transaction object
     */
    private _canShowPrivateKey() {
        try {
            this.common.privateKey = this.nem.passwordToPrivateKey(this.common.password, this.selectedWallet);
            return true;
        }
        catch (err) {
            return false;
        }
    }

    /**
     * Share current account through apps installed on the phone
     */
    public shareAddress() {
        if (this.platform.is('cordova')) {
            let textToShare = this.selectedWallet.address;
            this.socialSharing.share(textToShare.plain(), "My NEM Address", null, null).then(_ => {});
        }
        else this.alert.showFunctionallityOnlyAvailableInMobileDevices();
    }

    /**
     * Shows private key if private key is correct
     * @param transaction  transaction object
     */
    public showPrivateKey() {
        this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
            let loader = this.loading.create({
                content: res
            });

            loader.present().then(_ => {
                if (!this._canShowPrivateKey()) {
                    loader.dismiss();
                    this._clearCommon();
                    this.alert.showInvalidPasswordAlert();
                }
                else loader.dismiss();
            });
        });
    }

    /**
     * Copy private key to Clipboard
     */
    public copyPrivateKeyToClipboard(){
        if (this.platform.is('cordova')) {
            this.clipboard.copy(this.common.privateKey).then(_ => {
                this.toast.showPrivateKeyCopyCorrect();
            });
        }
        else this.alert.showFunctionallityOnlyAvailableInMobileDevices();
    }


    /**
     * Removes private key
     */
    public hidePrivateKey() {
        this._clearCommon();
    }

    /**
     * Clears data and moves to login screen
     * @param transaction  transaction object
     */
    public logout(){
        this.wallet.unsetSelectedWallet();
        this._clearCommon();
        this.navCtrl.setRoot(LoginPage);
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

}

