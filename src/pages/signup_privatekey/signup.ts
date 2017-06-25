import { Component } from '@angular/core';
import { App, LoadingController, AlertController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem.provider';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup-privatekey',
  templateUrl: 'signup.html'
})
export class SignupPrivateKeyPage {
  nem :any;
  newAccount: any;

  constructor(public app: App, private nemProvider: NemProvider,  public loading: LoadingController, public alertCtrl: AlertController) {
    this.nem = nemProvider;
    this.newAccount = {
      'name': '',
      'passphrase': '',
      'private_key': '',
      'repeat_passphrase':''
    };
  }

  public createPrivateKeyWallet(){
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
         this.nem.createPrivateKeyWallet(this.newAccount.name, this.newAccount.passphrase, this.newAccount.private_key, -104).then(
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
