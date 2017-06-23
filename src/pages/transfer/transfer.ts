import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { BalancePage } from '../balance/balance';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {
	nem: any;
    formData: any;
    selectedMosaic: any;
    divisibility: any;
    levy: any;
    common: any;
    amount: number;
    selectedWallet: any;
	selectedMosaicDefinitionMetaDataPair: any;
    
    constructor(public navCtrl: NavController,private navParams: NavParams, nemProvider: NemProvider,public alertCtrl: AlertController,) {
	    this.nem = nemProvider;
	    this.formData = {};
	    this.amount = 0;
	    this.formData.recipientPubKey = '';
	    this.formData.message = '';
	    this.selectedMosaic = navParams.get('selectedMosaic');
	    this.formData.fee = 0;
	    this.formData.encryptMessage = false;
	    this.formData.innerFee = 0;
	    this.formData.isMultisig = false;
	   	this.formData.isMosaicTransfer = false;
	   	this.formData.message = '';
	    this.selectedMosaicDefinitionMetaDataPair = undefined;
	    this.levy = undefined;
	    this.divisibility = undefined;

	    this.common = {
		    'password': '',
		    'privateKey': '',
		};
	    
	    if (this.selectedMosaic != 'nem:xem'){
		    this.nem.getMosaicsMetaDataPair(this.selectedMosaic.split(":")[0],  this.selectedMosaic.split(":")[1]).then(
		    	value =>{
		          	this.selectedMosaicDefinitionMetaDataPair =  value;
		   			this.levy = value.levy;
		    		this.divisibility = value.properties[0].value;
		    		if (this.divisibility == 0){
		    			this.divisibility = 1;
		    		}
		    		this.formData.isMosaicTransfer = true;
		    	}
		    )
		}
	}

	updateFees() {
	    let entity = this.nem.prepareTransaction(this.common, this.formData);
	   console.log("ENTITY");
	   console.log(entity);
	    console.log(this.formData);
	    if (this.formData.isMultisig) {
	        this.formData.innerFee = entity.otherTrans.fee;
	    } else {
	        this.formData.innerFee = 0;
	    }
	    this.formData.fee = entity.fee;
	    console.log(entity.fee + "FEE");
	}


	/**
	 * resetRecipientData() Reset data stored for recipient
	 */
	resetRecipientData() {
	    // Reset public key data
	    this.formData.recipientPubKey = '';
	    // Reset cleaned recipient address
	    this.formData.recipient = '';
	    // Encrypt message set to false
	    this.formData.encryptMessage = false;
	}

	checkAddress(address){
		var success = true;
        // Check if address is from network
        if (this.nem.isFromNetwork(address, -104)){
	   		this.formData.recipient = address;
        } 
        else {
            this.resetRecipientData();
            success = false;
        }
        return success;
    }

	/**
	 * processRecipientInput() Process recipient input and get data from network
	 *
	 * @note: I'm using debounce in view to get data typed with a bit of delay,
	 * it limits network requests
	 */
	processRecipientInput() {
	    // Reset recipient data
	    this.resetRecipientData();
	    var success = true;
	    // return if no value or address length < to min address length
	    if (!this.formData.rawRecipient || this.formData.rawRecipient.length < 40) {
	        success = false;
	    }

	    // Get recipient data depending of address
	    // Clean address
	    if(success){
	    	let recipientAddress = this.formData.rawRecipient.toUpperCase().replace(/-/g, '');
	    	success = this.checkAddress(recipientAddress);
	    }
	    return success;
	}

	startTransaction(){
		//if is nem:xem, set amount
	   if(this.selectedMosaic == 'nem:xem'){
	    	this.formData.mosaics = [];
	    	this.formData.amount = this.amount;
		}
		else {
		    this.formData.amount = 1; // Always send 1
		    var namespace_mosaic = this.selectedMosaic.split(":");
		    this.formData.mosaics = [{
		        'mosaicId': {
		            'namespaceId': namespace_mosaic[0],
		            'name': namespace_mosaic[1]
		        },
		        'quantity': this.amount * Math.pow(10, this.divisibility)
		    }];
		}
		this.updateFees();
		this.presentPrompt();
	}

	canSendTransaction(){
		return this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo);
	}

	confirmTransaction(){
		let entity = this.nem.prepareTransaction(this.common, this.formData);
    	return this.nem.confirmTransaction(this.common, entity);
	}

	subtitleBuilder(){
		var subtitle = 'You are going to send: <br/><br/> ';
		var currency = '';
		if (this.selectedMosaic == 'nem:xem'){
			currency = "<b>Amount:</b> " + this.amount + " nem:xem";
		}
		else{
			currency = "<b>Amount:</b> " + this.amount + " " + this.selectedMosaic;
		}
		subtitle += currency;

		var _fee = this.formData.fee/1000000;
		//Todo levy
		subtitle += '<br/><br/>  <b>Fee:</b> ' + _fee + ' xem';
		return subtitle;

	}
	presentPrompt() {
		if(!this.processRecipientInput()){
			let alert = this.alertCtrl.create({
		        title: 'Address is not valid for this network',
		        subTitle: 'Remember that at the moment only works on testnet',
		        buttons: ['OK']
		      });
		      alert.present();
		}
		else{

			let alert = this.alertCtrl.create({
			    title: 'Confirm Transaction',
			    subTitle: this.subtitleBuilder(),
			    inputs: [
			      {
			        name: 'passphrase',
			        placeholder: 'Passphrase/Password'
			      },
			    ],
			    buttons: [
			      {
			        text: 'Cancel',
			        role: 'cancel',
			        handler: data => {
			          console.log('Cancel clicked');
			        }
			      },
			      {
			        text: 'Confirm Transaction',
			        handler: data => {
			        	this.common.password = data.passphrase;
			        	if(this.canSendTransaction())
			        	{
			        		this.confirmTransaction().then(_ => {
			        			console.log("Transaction confirmed");
			        			this.navCtrl.push(BalancePage, {sendSuccess:true});
			        		}).catch(error => {
					    		let alert = this.alertCtrl.create({
							        title: error,
							        buttons: ['OK']
							      });
							      alert.present();
								});
			        	}
			        	else{
		        			let alert = this.alertCtrl.create({
							    title: 'Invalid password',
							    subTitle: '',
							    buttons: ['OK']
							  });
							  alert.present();
			        	}
			        }
			      }
			    ]
			  });
		  	alert.present();
		}
	}

	ionViewWillEnter() {
	  	this.nem.getSelectedWallet().then(
	        value =>{
	          	if(!value){
	           		this.navCtrl.push(LoginPage);
	        	}
	        	else{
	        		this.selectedWallet = value;
	        	}
	    	}
	    )
 	}
}
