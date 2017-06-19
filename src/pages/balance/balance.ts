import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { TransferPage } from '../transfer/transfer';
import { NemProvider } from '../../providers/nem/nem';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage {
  nem: any;
  selectedWallet: any;
  balance: any;

  constructor(public navCtrl: NavController,  nemProvider: NemProvider, public alertCtrl: AlertController, public loading: LoadingController) {
  	
  	let loader = this.loading.create({
        content: "Please wait..."
      });

    loader.present();

  	this.nem = nemProvider;

  	this.nem.getSelectedWallet().then(
        value =>{
          if(!value){
           this.navCtrl.push(LoginPage);
           loader.dismiss();
          }
          else{
	          this.nem.getBalance(value.accounts[0].address).then(
	           	value =>{
	           		console.log(value.data);
	           		this.balance = value.data;
	       			loader.dismiss();
	       		})
	        }
    	}
    )
  }

  goToTransfer(params){
    if (!params) params = {};
    this.navCtrl.push(TransferPage);
  }
}
