import { Component } from '@angular/core';
import { NavController,LoadingController  } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html'
})
export class TransactionsUnconfirmedPage {
	nem: any;
	transactions: any;

  constructor(public navCtrl: NavController, private nemProvider: NemProvider,  public loading: LoadingController) {
  	this.nem = nemProvider;
  	this.transactions = undefined;
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
	        		this.nem.getUnconfirmedTransactionsFromAnAccount(value.accounts[0].address).then(
		           		value =>{
		           			this.transactions = value;
		       			loader.dismiss();
		       		})
	        	}
	    	}
	    )
 	}

}
