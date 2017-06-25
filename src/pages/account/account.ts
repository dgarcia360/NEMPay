import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as kjua from "kjua";

import { NemProvider } from '../../providers/nem/nem.provider';
import { AlertProvider } from '../../providers/alert/alert.provider';

import {LoginPage} from "../login/login";

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage {
    nem: any;
    common: any;
    selectedWallet: any;
    address: any;
    name: any;
    qrCode: any;

    constructor(public navCtrl: NavController, private nemProvider: NemProvider, private socialSharing: SocialSharing, private loading: LoadingController, private alert:AlertProvider) {
        this.selectedWallet = null;

        // Object to contain our password & private key data.
        this.common = {};
        this.cleanCommon();
        this.qrCode = {'src' : ''};


    }

    ionViewWillEnter() {
        
        let loader = this.loading.create({
            content: "Please wait..."
        });

        this.nemProvider.getSelectedWallet().then(
            value =>{
                if(!value){
                    this.navCtrl.push(LoginPage);
                }
                else{
                    this.selectedWallet = value;
                    let infoQR = JSON.stringify({
                        "v": -104,
                        "type": 1,
                        "data": {
                            "addr": this.selectedWallet.accounts[0].address,
                            "name": this.selectedWallet.name,
                        }
                    });
                    this.encodeQrCode(infoQR);
                    loader.dismiss();
                }
            }
        )
    }

    encodeQrCode(text) {
        this.qrCode = kjua({
            size: 256,
            text: text,
            fill: '#000',
            quiet: 0,
            ratio: 2,
        });
    }


    shareAddress(){
        this.socialSharing.share(this.address, "My NEM Address").then(() => {});
    }

        showPrivateKey(){

        let loader = this.loading.create({
            content: "Please wait..."
        });

        loader.present().then(
            _ => {
                if (!this.nemProvider.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo) || !this.nemProvider.checkAddress(this.common.privateKey, this.selectedWallet.accounts[0].network, this.selectedWallet.accounts[0].address)) {
                    loader.dismiss();
                    this.alert.showInvalidPasswordAlert();
                }
                else {
                    loader.dismiss();
                }
            })
    }

    cleanCommon(){
        this.common = {
            'password': '',
            'privateKey': ''
        };
    }


    logout(){
        this.nemProvider.unsetSelectedWallet();
        this.navCtrl.push(LoginPage);
    }
}

