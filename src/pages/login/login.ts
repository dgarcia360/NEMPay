import { Component } from '@angular/core';
import { MenuController,NavController, AlertController, LoadingController } from 'ionic-angular';
import { BalancePage } from '../balance/balance';
import { SignupPage } from '../signup/signup';
import { NemProvider } from '../../providers/nem/nem';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  nem: any;
  wallets: any;
  selectedWallet: any;
  common: any;
  menu: MenuController;


  constructor(public navCtrl: NavController,  nemProvider: NemProvider, public alertCtrl: AlertController, public loading: LoadingController, menu: MenuController) {

     this.menu = menu;

    this.nem = nemProvider;
    this.wallets = [];
    this.selectedWallet = null;

    // Object to contain our password & private key data.
    this.common = {
      'password': '',
      'privateKey': ''
    };

    this.nem.getWallets().then(
        value => {
          this.wallets = value;
          if(this.wallets.length > 0){
            console.log(this.selectedWallet);
          }
        }
    );
  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.name === e2.name : e1 === e2;
  }

  login() {

    let loader = this.loading.create({
      content: "Please wait..."
    });

    loader.present();

    if (!this.selectedWallet) {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Wallet not selected',
        subTitle: '',
        buttons: ['OK']
      });
      alert.present();
    }
    // Decrypt/generate private key and check it. Returned private key is contained into this.common
    if (!this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo) || !this.nem.checkAddress(this.common.privateKey, this.selectedWallet.accounts[0].network, this.selectedWallet.accounts[0].address)) {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Invalid password',
        subTitle: '',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      this.nem.setSelectedWallet(this.selectedWallet);
      loader.dismiss();
      this.navCtrl.push(BalancePage);
    }
  }

  goToSignup(params){
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }

  ionViewWillEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the left menu when leaving the login page
    this.menu.enable(true);
  }

}
