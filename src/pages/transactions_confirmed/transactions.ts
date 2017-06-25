import { Component } from '@angular/core';
import { NavController,  LoadingController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem.provider';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html'
})
export class TransactionsConfirmedPage {
	nem: any;
	transactions: any;
	address: any;
	
  constructor(public navCtrl: NavController, private nemProvider: NemProvider,  public loading: LoadingController) {
  	this.nem = nemProvider;
  	this.transactions = [];
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
	        		this.nem.getAllTransactionsFromAnAccount(this.address).then(
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
