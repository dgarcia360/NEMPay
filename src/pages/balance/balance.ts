import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, MenuController } from 'ionic-angular';
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
  selectedMosaic: any;
  menu: any;

  constructor(public navCtrl: NavController,  nemProvider: NemProvider, public alertCtrl: AlertController, public loading: LoadingController, menu: MenuController) {
  		this.nem = nemProvider;
  		this.menu = menu;
  }

	ionViewWillEnter() {
		// this.menu.showBackButton(false);

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
	if (!params) params = {};
	this.navCtrl.push(TransferPage, {
    	selectedMosaic: this.selectedMosaic.mosaicId.namespaceId+':'+this.selectedMosaic.mosaicId.name,
	});
	}

}
