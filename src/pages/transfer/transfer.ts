import { Component } from '@angular/core';
import { NavController,NavParams, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NemProvider } from '../../providers/nem/nem.provider';
import { AlertProvider } from '../../providers/alert/alert.provider';

import { BalancePage } from '../balance/balance';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {
	
    formData: any;
    selectedMosaic: any;
    divisibility: any;
    levy: any;
    common: any;
    amount: number;
    selectedWallet: any;
	selectedMosaicDefinitionMetaDataPair: any;

    constructor(public navCtrl: NavController,private navParams: NavParams, private nem: NemProvider,private alert: AlertProvider, private barcodeScanner: BarcodeScanner,private alertCtrl: AlertController) {
	    
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
		    this.nem.getMosaicsMetaDataPair(this.selectedMosaic.split(":")[0],  this.selectedMosaic.split(":")[1], false).then(
		    	value =>{
		          	this.selectedMosaicDefinitionMetaDataPair =  value;
		   			this.levy = value.levy;
		    		this.divisibility = value.properties[0].value;
		    		this.formData.isMosaicTransfer = true;
		    	}
		    )
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

	cleanCommon(){
        this.common = {
            'password': '',
            'privateKey': ''
        };
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

	presentPrompt() {

			let alert = this.alertCtrl.create({
			    title: 'Confirm Transaction',
			    subTitle: this._subtitleBuilder(),
			    inputs: [
			      {
			        name: 'passphrase',
			        placeholder: 'Passphrase/Password',
			        type: 'password'
			      },
			    ],
			    buttons: [
			      {
			        text: 'Cancel',
			        role: 'cancel'
			      },
			      {
			        text: 'Confirm Transaction',
			        handler: data => {
			        	this.common.password = data.passphrase;
			        	
			        	if(this.canSendTransaction())
			        	{
			        		this.confirmTransaction().then(_ => {
			        			this.navCtrl.push(BalancePage, {sendSuccess:true});
			        			this.cleanCommon();
			        		}).catch(error => {
					    		this.alert.showError(error);
					    		this.cleanCommon();
					    	});
			        	}
			        	else{
		        			this.alert.showInvalidPasswordAlert();
			        	}
			        }
			      }
			    ]
			  });
		  	alert.present();
	}


	updateFees() {
	    if(this.formData.isMosaicTransfer){
			    this.nem.prepareMosaicTransaction(this.common, this.formData).then(entity => {
				   	console.log(entity);
				    this.formData.innerFee = 0;
				    this.formData.fee = entity.fee;
					this.presentPrompt();
			   });
	    }
	    else {
			var entity = this.nem.prepareTransaction(this.common, this.formData);
			this.formData.innerFee = 0;
			this.formData.fee = entity.fee;
			this.presentPrompt();
	    }
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
		if(!this.processRecipientInput()){
			this.alert.showAlertDoesNotBelongToNetwork();
		}
		else{
			this.updateFees();
		}
	}
	
	private _subtitleBuilder():string{
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
		
		subtitle += '<br/><br/>  <b>Fee:</b> ' + _fee + ' xem';
		return subtitle;

	}

	canSendTransaction(){
		return this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo);
	}

	confirmTransaction(){

		if(this.formData.isMosaicTransfer){
			   return this.nem.prepareMosaicTransaction(this.common, this.formData).then(entity => {
			   		 return this.nem.confirmTransaction(this.common, entity);
			   });
	      }

	      else {
   			var entity = this.nem.prepareTransaction(this.common, this.formData);
    		return this.nem.confirmTransaction(this.common, entity);
	      }
	}

	scanQR(){
		this.barcodeScanner.scan().then((barcodeData) => {
            var addresObject = JSON.parse(barcodeData.text);
            this.formData.rawRecipient = addresObject.data.addr;
		}, (err) => {
    		console.log("Error on scan");
		});
	}
}
