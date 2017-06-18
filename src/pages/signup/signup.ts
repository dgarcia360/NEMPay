import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  nem: any;

  constructor(public navCtrl: NavController, public nemProvider: NemProvider) {
    this.nem = nemProvider.getProvider();
  }

  public createBrainWallet(){
    let walletName = "BrainWallet";
    let password = "Something another thing d and something else";
    let wallet = this.nem.default.model.wallet.createBrain(walletName, password, this.nem.default.model.network.data.testnet.id);
    console.log(wallet);
    console.log(this.nem);
  }

  
}
