import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  nem :any;
  menu: MenuController;
  newAccount: any;

  constructor(public navCtrl: NavController, private nemProvider: NemProvider,  public loading: LoadingController, menu: MenuController, public alertCtrl: AlertController) {
    this.menu = menu;
    this.nem = nemProvider;
    this.newAccount = {
      'name': '',
      'passphrase': '',
      'repeat_passphrase':''
    };
  }

  public createBrainWallet(){
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

      loader.present();

      this.nem.createBrainWallet(this.newAccount.name, this.newAccount.passphrase, -140).then(
        value =>{
          if(value){
           this.navCtrl.push(LoginPage);
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
    }
  }

  ionViewWillEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the left menu when leaving the login page
    this.menu.enable(true);
  }

}
