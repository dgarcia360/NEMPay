import {Component} from '@angular/core';
import {NavController, Platform, LoadingController} from 'ionic-angular';
import { Subscription } from 'rxjs';

import {SocialSharing} from '@ionic-native/social-sharing';

import {TranslateService} from '@ngx-translate/core';

import * as kjua from "kjua";

import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';

import {ConfigProvider} from '../../providers/config/config.provider';

import {LoginPage} from "../login/login";

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage {
    common: any;
    selectedWallet: any;
    qrCode: any;
    private onResumeSubscription: Subscription;

    constructor(public navCtrl: NavController, private nem: NemProvider, private socialSharing: SocialSharing, private loading: LoadingController, private alert: AlertProvider, private config: ConfigProvider,private platform: Platform, public translate: TranslateService) {
        this.selectedWallet = {accounts: [{'address': ''}]};

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
        this.nem.getSelectedWallet().then(
            value => {
                if (!value) {
                    this.navCtrl.setRoot(LoginPage);
                }
                else {
                    this.selectedWallet = value;
                    let infoQR = JSON.stringify({
                        "v": this.config.defaultNetwork(),
                        "type": 1,
                        "data": {
                            "addr": this.selectedWallet.accounts[0].address,
                            "name": this.selectedWallet.name,
                        }
                    });
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
        var result = this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo) || !this.nem.checkAddress(this.common.privateKey, this.selectedWallet.accounts[0].network, this.selectedWallet.accounts[0].address);
        if (!(this.common.privateKey.length === 64 || this.common.privateKey.length === 66)) result = false;
        return result;
    }

    /**
     * Share current account through apps installed on the phone
     */
    public shareAddress() {
        var textToShare = this.selectedWallet.accounts[0].address;
        this.socialSharing.share(textToShare, "My NEM Address", null, null).then(_ => {

        });
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

            loader.present().then(
                _ => {
                    if (!this._canShowPrivateKey()) {
                        loader.dismiss();
                        this._clearCommon();
                        this.alert.showInvalidPasswordAlert();
                    }
                    else {
                        loader.dismiss();
                    }
                });
        });
    }

    /**
     * Removes private key
     */
    public hidePrivateKey(){
        this._clearCommon();
    }

    /**
     * Clears data and moves to login screen
     * @param transaction  transaction object
     */
    public logout() {
        this.nem.unsetSelectedWallet();
        this._clearCommon();
        this.navCtrl.setRoot(LoginPage);
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

}

