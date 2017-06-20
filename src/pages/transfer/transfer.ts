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
    mosaicsMetaData: any;
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

	    this.mosaicsMetaData = undefined;
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
		          	this.mosaicsMetaData = value;
		          	this.selectedMosaicDefinitionMetaDataPair =  this.mosaicsMetaData[this.selectedMosaic];
		   			this.levy = this.selectedMosaicDefinitionMetaDataPair.mosaicDefinition.levy;
		    		this.divisibility = this.selectedMosaicDefinitionMetaDataPair.mosaicDefinition.properties[0].value;
		    		this.formData.isMosaicTransfer = true;
		    	}
		    )
		}
	}

	updateFees() {
	    let entity = this.nem.prepareTransaction(this.common, this.formData);
	    if (this.formData.isMultisig) {
	        this.formData.innerFee = entity.otherTrans.fee;
	    } else {
	        this.formData.innerFee = 0;
	    }
	    this.formData.fee = entity.fee;
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
		var has_error = false;
        // Check if address is from network
        if (this.nem.isFromNetwork(address, -104)){
	   		this.formData.recipient = address;
        } 
        else {
            this.resetRecipientData();
            has_error = true;
        }
        return has_error;
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
	    var has_error = false;
	    // return if no value or address length < to min address length
	    if (!this.formData.rawRecipient || this.formData.rawRecipient.length < 40) {
	        has_error = true;
	    }

	    // Get recipient data depending of address
	    // Clean address
	    if(!has_error){
	    	let recipientAddress = this.formData.rawRecipient.toUpperCase().replace(/-/g, '');
	    	has_error = this.checkAddress(recipientAddress);

	    }
	    return has_error;
	}

	startTransaction(){
		//if is nem:xem, set amount
	   if(this.selectedMosaic == 'nem:xem'){
	    	this.formData.mosaics = [];
	    	this.formData.amount = this.amount;
		}
		else {
		    this.formData.amount = 1; // Always send 1, this represents the amount of mosaics send

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


	confirmTransaction(){
		let entity = this.nem.prepareTransaction(this.common, this.formData);

		if (!this.nem.passwordToPrivateKey(this.common, this.selectedWallet.accounts[0], this.selectedWallet.accounts[0].algo)) {
			  let alert = this.alertCtrl.create({
			    title: 'Invalid password',
			    subTitle: '',
			    buttons: ['OK']
			  });
			  alert.present();
			  return false;
    	}
    	else{
    		this.nem.confirmTransaction(this.common, entity);
    		return true;
    	}

	}

	presentPrompt() {
		if(!this.processRecipientInput()){
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
			if (this.formData.isMosaicTransfer) _fee +1;
			subtitle += '<br/><br/>  <b>Fee:</b> ' + _fee + ' xem';

		  let alert = this.alertCtrl.create({
		    title: 'Confirm Transaction',
		    subTitle: subtitle,
		    inputs: [
		      {
		        name: 'passphrase',
		        placeholder: 'Passphrase'
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
		          if (this.confirmTransaction()) {
		           	this.navCtrl.push(BalancePage, {sendSuccess:true});
		          } else {
		            // invalid login
		            return false;
		          }
		        }
		      }
		    ]
		  });
	  		alert.present();
		}
		else{

		let alert = this.alertCtrl.create({
	        title: 'Address is not valid for this network',
	        subTitle: 'Remember that at the moment only works on testnet',
	        buttons: ['OK']
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
