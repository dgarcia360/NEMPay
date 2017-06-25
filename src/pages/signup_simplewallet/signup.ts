import { Component } from '@angular/core';
import { App, MenuController, LoadingController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem.provider';
import { AlertProvider } from '../../providers/alert/alert.provider';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup-simple-wallet',
  templateUrl: 'signup.html'
})
export class SignupSimpleWalletPage {
  newAccount: any;

  constructor(public app: App, private nem: NemProvider,  private loading: LoadingController, private alert: AlertProvider) {
    this.newAccount = {
      'name': '',
      'passphrase': '',
      'repeat_passphrase':''
    };
  }

  public createSimpleWallet(){
    if (this.newAccount.passphrase != this.newAccount.repeat_passphrase){
         this.alert.showPasswordDoNotMatch();
    }
    else{
      let loader = this.loading.create({
        content: "Please wait..."
      });

      loader.present().then(_ =>{
         this.nem.createSimpleWallet(this.newAccount.name, this.newAccount.passphrase, -104).then(
              value =>{
                if(value){
                 loader.dismiss();
                 this.app.getRootNav().push(LoginPage);
                }
                else{
                    loader.dismiss();
                    this.alert.showWalletNameAlreadyExists();
                }
              }
            )
      })
    }
  }
}
