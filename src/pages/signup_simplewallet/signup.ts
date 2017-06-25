import { Component } from '@angular/core';
import { App, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem.provider';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup-simple-wallet',
  templateUrl: 'signup.html'
})
export class SignupSimpleWalletPage {
  nem :any;
  newAccount: any;

  constructor(public app: App, private nemProvider: NemProvider,  public loading: LoadingController, public alertCtrl: AlertController) {
    this.nem = nemProvider;
    this.newAccount = {
      'name': '',
      'passphrase': '',
      'repeat_passphrase':''
    };
  }

  public createSimpleWallet(){
    if (this.newAccount.passphrase != this.newAccount.repeat_passphrase){
         let alert = this.alertCtrl.create({
            title: 'Passphrase do not match',
            subTitle: '',
            buttons: ['OK']
          });
          alert.present();
    }
    else{
      let loader = this.loading.create({
        content: "Please wait..."
      });

      loader.present().then(_ =>{
         this.nem.createSimpleWallet(this.newAccount.name, this.newAccount.passphrase, -140).then(
              value =>{
                if(value){
                 this.app.getRootNav().push(LoginPage);
                 loader.dismiss();
                }
                else{
                    loader.dismiss();
                    let alert = this.alertCtrl.create({
                      title: 'Wallet name already exists',
                      subTitle: '',
                      buttons: ['OK']
                    });
                    alert.present();
                }
              }
            )
      })
    }
  }
}
