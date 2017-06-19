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

  //todo: remove
  public getProvider(){
    return this.nem;
  }

  /* Wallets */
  public getWallets(): any{
    return this._storage.get('wallets').then(data => {
      var result = [];
      if(data){
        result = JSON.parse(data);
      }
      return result;
    });
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

  public setSelectedWallet(wallet){
    this._storage.set('selectedWallet', JSON.stringify(wallet));
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

}
