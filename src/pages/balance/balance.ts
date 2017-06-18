import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TransferPage } from '../transfer/transfer';

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage {

  constructor(public navCtrl: NavController) {
  }
  goToTransfer(params){
    if (!params) params = {};
    this.navCtrl.push(TransferPage);
  }
}
