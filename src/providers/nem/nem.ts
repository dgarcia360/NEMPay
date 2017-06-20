import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import * as nemSdk from "nem-sdk";

/*
 Generated class for the NemSdkProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class NemProvider {
  nem: any;
  _storage: any;
  //todo: type array of wallet
  wallets : any;

  constructor(private storage: Storage) {
    console.log('Hello NemSdkProvider Provider');
    this.nem = nemSdk;
    this._storage = storage;
  }

  /* Wallet */
  private _storeWallet(wallet) : any{
    var result = [];
    return this.getWallets().then(
        value => {
          result = value;
          result.push(wallet);
          this._storage.set('wallets', JSON.stringify(result));
          return wallet;
        }
    )
  }

  private _checkIfWalletNameExists(walletName) : any{
    var exists = false;
    
    return this.getWallets().then(
        value => {
          var result = value || [];

          for (var i = 0; i < result.length; i++) {
              console.log(walletName);
              console.log(result[i].name);
              if(result[i].name == walletName){
                exists = true;
                break;
              }
          }
          return exists;
        }
    )
  }

  public checkAddress(privateKey, network, address){
    return this.nem.default.crypto.helpers.checkAddress(privateKey, network, address);
  }

  public passwordToPrivateKey(common, walletAccount, algo){
    return this.nem.default.crypto.helpers.passwordToPrivatekey(common, walletAccount, algo);
  }

  public getSelectedWallet(): any{
    return this._storage.get('selectedWallet').then(data => {
      var result = null;
      if(data){
        result = JSON.parse(data);
      }
      return result;
    });
  }

  public getWallets(): any{
    return this._storage.get('wallets').then(data => {
      var result = [];
      if(data){
        result = JSON.parse(data);
      }
      return result;
    });
  }
  
  public setSelectedWallet(wallet){
    this._storage.set('selectedWallet', JSON.stringify(wallet));
  }

   public unsetSelectedWallet(){
    this._storage.set('selectedWallet', null);
  }


  public createBrainWallet(walletName, password, network){
    //TODO: make able to choose netwok
    let wallet = this.nem.default.model.wallet.createBrain(walletName, password, this.nem.default.model.network.data.testnet.id);

    return this._checkIfWalletNameExists(walletName).then(
      value =>{
        if(value){
          return null;
        }
        else{
          return this._storeWallet(wallet).then(
            value => {
              return value;
            }
          )
        }
      }
    )
  }

  /* Balance */

  public getBalance(address){
     var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
    // Gets account data
    return this.nem.default.com.requests.account.mosaics(endpoint, address).then(
      value => {
        console.log(value);
        return value;
      }
    ).catch(error => {
      return false;
    })
  }

  /* Transfer */
  public isFromNetwork (address, isFromNetwork){
    return this.nem.default.model.address.isFromNetwork(address,  this.nem.default.model.network.data.testnet.id);
  }

  public getMosaicsMetaDataPair(mosaicNamespaceId, mosaicId){
        // init endpoint
      var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
      
      var mosaicDefinitionMetaDataPair = this.nem.default.model.objects.get("mosaicDefinitionMetaDataPair");

       return this.nem.default.com.requests.namespace.mosaicDefinitions(endpoint, mosaicNamespaceId).then(
          value => {
              console.log(value);
              // Look for the mosaic definition(s) we want in the request response (Could use ["eur", "usd"] to return eur and usd mosaicDefinitionMetaDataPairs)
              var neededDefinition = this.nem.default.utils.helpers.searchMosaicDefinitionArray(value, [mosaicId]);
              console.log(neededDefinition);

              // Get full name of mosaic to use as object key
              var fullMosaicName  = mosaicNamespaceId+ ':' + mosaicId;

              // Check if the mosaic was found
              if(undefined === neededDefinition[fullMosaicName]) return console.error("Mosaic not found !");

              // Set eur mosaic definition into mosaicDefinitionMetaDataPair
              mosaicDefinitionMetaDataPair[fullMosaicName] = {};
              mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];
          
          return mosaicDefinitionMetaDataPair;
      }
    );
  }


  public prepareTransaction(common, formData){
    // Create transfer transaction
    var transferTransaction = this.nem.default.model.objects.create("transferTransaction")(formData.recipient, formData.amount, formData.message);
   
    if(formData.isMosaicTransfer){
      var mosaicAttachment = this.nem.default.model.objects.create("mosaicAttachment")(formData.mosaics[0].mosaicId.namespaceId, formData.mosaics[0].mosaicId.name, formData.mosaics[0].quantity);
      transferTransaction.mosaics.push(mosaicAttachment);
    }

    return this.nem.default.model.transactions.prepare("transferTransaction")(common, transferTransaction, this.nem.default.model.network.data.testnet.id);
  }


  public confirmTransaction(common, transactionEntity){
    var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
    this.nem.default.model.transactions.send(common, transactionEntity, endpoint);
  }

}
