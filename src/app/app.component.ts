import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TransferPage } from '../pages/transfer/transfer';
import { AccountPage } from '../pages/account/account';
import { TransactionsPage } from '../pages/transactions/transactions';
import { BalancePage } from '../pages/balance/balance';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  goToBalance(params){
    if (!params) params = {};
    this.navCtrl.setRoot(BalancePage);
  }
  goToAccount(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AccountPage);
  }

  goToTransactions(params){
    if (!params) params = {};
    this.navCtrl.setRoot(TransactionsPage);
  }
}
