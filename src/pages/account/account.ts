import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from "../login/login";
import { NemProvider } from '../../providers/nem/nem';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as kjua from "kjua";

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  nem: any;
  selectedWallet: any;
  address: any;
  name: any;
  accountString: any;
  accountInforModelQR: any;
  qrCode: any;
  constructor(public navCtrl: NavController,nemProvider: NemProvider, private socialSharing: SocialSharing) {
	this.selectedWallet = null;
		this.nem = nemProvider;
		this.nem.getSelectedWallet().then(
        value =>{
          	if(!value){
           		this.navCtrl.push(LoginPage);
        	}
        	else{
        		this.address = value.accounts[0].address;
        		this.name = value.name;
        	}
    	}
    )
    this.accountInforModelQR = {
        "v": -104,
        "type": 1,
        "data": {
            "addr": this.address,
            "name": this.name
        }
    }

	this.accountString = JSON.stringify(this.accountInforModelQR);
	this.encodeQrCode(this.accountString);
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

  addressSocialSharing(){
  	  this.socialSharing.share(this.address, "My NEM Address").then(() => {});
  }

  logout(){
  	this.nem.unsetSelectedWallet();
    this.navCtrl.push(LoginPage);
  }

}

