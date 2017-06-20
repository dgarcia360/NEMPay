import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { MyApp } from './app.component';
import { BalancePage } from '../pages/balance/balance';
import { TransactionsPage } from '../pages/transactions/transactions';
import { TransferPage } from '../pages/transfer/transfer';
import { AccountPage } from '../pages/account/account';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NemProvider } from '../providers/nem/nem';

@NgModule({
  declarations: [
    MyApp,
    BalancePage,
    TransactionsPage,
    TransferPage,
    AccountPage,
    SignupPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BalancePage,
    TransactionsPage,
    TransferPage,
    AccountPage,
    SignupPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NemProvider,
    SocialSharing
  ]
})
export class AppModule {}