import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BalancePage } from '../balance/balance';
import { TransferPage } from '../transfer/transfer';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }
  goToBalance(params){
    if (!params) params = {};
    this.navCtrl.push(BalancePage);
  }

  goToTransfer(params){
    if (!params) params = {};
    this.navCtrl.push(TransferPage);
  }

  goToSignup(params){
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }
}
