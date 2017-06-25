import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { NemProvider } from '../../providers/nem/nem.provider';

import { TransferPage } from '../transfer/transfer';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage {
  selectedWallet: any;
  balance: any;
  selectedMosaic: any;

  constructor(public navCtrl: NavController,  private nem: NemProvider,  private loading: LoadingController) {
  
  }

	ionViewWillEnter() {

		let loader = this.loading.create({
		content: "Please wait..."
		});

	  	this.nem.getSelectedWallet().then(
	        value =>{
	          	if(!value){
	           		this.navCtrl.push(LoginPage);
	        	}
	        	else{
	        		loader.present();
	        		this.nem.getBalance(value.accounts[0].address).then(
		           		value =>{
		           			this.balance = value.data;
		       			loader.dismiss();
		       		})
	        	}
	    	}
	    )
 	}

	goToTransfer(params){
		this.navCtrl.push(TransferPage, {
	    	selectedMosaic: this.selectedMosaic.mosaicId.namespaceId+':'+this.selectedMosaic.mosaicId.name,
			quantity: this.selectedMosaic.quantity,
		});
	}
}
