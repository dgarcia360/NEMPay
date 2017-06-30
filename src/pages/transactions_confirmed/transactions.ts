import { Component } from '@angular/core';
import { NavController,  LoadingController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastProvider } from '../../providers/toast/toast.provider';
import { NemProvider } from '../../providers/nem/nem.provider';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html'
})
export class TransactionsConfirmedPage {
	transactions: any;
	address: any;
	
  constructor(public navCtrl: NavController, private nem: NemProvider,  private loading: LoadingController, private toast: ToastProvider, private clipboard: Clipboard) {
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
		           			console.log(this.transactions);
		       			loader.dismiss();
		       		})
	        	}
	    	}
	    )
 	}

 	copyTransactionAddress(transaction, isAccountRecipient){
 		var address;
 		if (this.address == transaction.recipient){
 			address = this.nem.pubToAddress(transaction.signer);
 		}
 		else{
 			address = transaction.recipient;
 		}

 		this.clipboard.copy(address).then(_=>{
 			this.toast.showCopyCorrect();
 		});
 	}

}
