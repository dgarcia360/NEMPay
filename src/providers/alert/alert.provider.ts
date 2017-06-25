import { Injectable } from '@angular/core';
import { AlertController  } from 'ionic-angular';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the Alert provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class AlertProvider {

  constructor(private alertCtrl : AlertController) {
  
  }

  
  showWalletNotSelectedAlert(){
     let alert = this.alertCtrl.create({
        title: 'Wallet not selected',
        subTitle: '',
        buttons: ['OK']
      });

     alert.present()
     return alert;
  }
  
  showInvalidPasswordAlert(){
    let alert = this.alertCtrl.create({
      title: 'Provided password or passphrase is invalid',
      subTitle: '',
      buttons: ['OK']
    });
     alert.present()
     return alert;
  }

  showNoInternetConnectionAlert(){


  }


    

}
