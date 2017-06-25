import { Component } from '@angular/core';
import { NavController,LoadingController  } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem.provider';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html'
})
export class TransactionsUnconfirmedPage {
	transactions: any;
	address: any;
	
  constructor(public navCtrl: NavController, private nem: NemProvider,  private loading: LoadingController) {
  	this.transactions = undefined;
  	this.address = '';

  }

	ionViewWillEnter() {
		let loader = this.loading.create({
			content: "Please wait..."
		});

	  	this.nem.getSelectedWallet().then(
	        value =>{
	        	this.address = value.accounts[0].address;
	          	if(!value){
	           		this.navCtrl.push(LoginPage);
	        	}
	        	else{
	        		loader.present();
	        		this.nem.getUnconfirmedTransactionsFromAnAccount(value.accounts[0].address).then(
		           		value =>{
		           			this.transactions = value;
		           			console.log(value);
		       			loader.dismiss();
		       		})
	        	}
	    	}
	    )
 	}

}
