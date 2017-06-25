import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { SignupBrainWalletPage } from '../signup_brainwallet/signup';
import { SignupSimpleWalletPage } from '../signup_simplewallet/signup';
import { SignupPrivateKeyPage } from '../signup_privatekey/signup';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  menu: MenuController;
  tab1Root = SignupBrainWalletPage;
  tab2Root = SignupSimpleWalletPage;
  tab3Root = SignupPrivateKeyPage;
  constructor(public navCtrl: NavController,  menu: MenuController) {
    this.menu = menu;
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
