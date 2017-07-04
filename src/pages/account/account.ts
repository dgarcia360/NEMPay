import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
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

    constructor(public navCtrl: NavController, private nem: NemProvider, private socialSharing: SocialSharing, private loading: LoadingController, private alert: AlertProvider, private config: ConfigProvider) {
        this.selectedWallet = {accounts: [{'address': ''}]};

        //Stores sensitive data.
        this.common = {};
        //Initialize common
        this.cleanCommon();

        this.qrCode = {'src': ''};
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
                    this.encodeQrCode(infoQR);
                }
            }
        )
    }

    /**
     * Clears sensitive data
     */
    cleanCommon() {
        this.common = {
            'password': '',
            'privateKey': ''
        };
    }

    /**
     * Encodes infoQR json into an image
     * @param infoQR  Object containing account information
     */
    encodeQrCode(infoQR) {
        this.qrCode = kjua({
            size: 256,
            text: infoQR,
            fill: '#000',
            quiet: 0,
            ratio: 2,
        });
    }

    /**
     * Share current account through apps installed on the phone
     */
    shareAddress() {
        var textToShare = this.selectedWallet.accounts[0].address;
        this.socialSharing.share(textToShare, "My NEM Address", null, null).then(_ => {

        });
    }

    /**
     * Determines if private key can be shown, if it is correct
     * @param transaction  transaction object
     */
    canShowPrivateKey() {
        var result = this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo) || !this.nem.checkAddress(this.common.privateKey, this.selectedWallet.accounts[0].network, this.selectedWallet.accounts[0].address);
        if (!(this.common.privateKey.length === 64 || this.common.privateKey.length === 66)) result = false;
        return result;
    }

    /**
     * Shows private key if private key is correct
     * @param transaction  transaction object
     */
    showPrivateKey() {

        let loader = this.loading.create({
            content: "Please wait..."
        });

        loader.present().then(
            _ => {
                if (!this.canShowPrivateKey()) {
                    loader.dismiss();
                    this.cleanCommon();
                    this.alert.showInvalidPasswordAlert();
                }
                else {
                    loader.dismiss();
                }
            })
    }

    /**
     * Clears data and moves to login screen
     * @param transaction  transaction object
     */
    logout() {
        this.nem.unsetSelectedWallet();
        this.cleanCommon();
        this.navCtrl.setRoot(LoginPage);
    }
}

