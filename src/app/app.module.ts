import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BalancePage } from '../pages/balance/balance';
import { TransactionsPage } from '../pages/transactions/transactions';
import { TransferPage } from '../pages/transfer/transfer';
import { AccountPage } from '../pages/account/account';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ConfirmTransactionPage } from '../pages/confirm-transaction/confirm-transaction';

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
    LoginPage,
    ConfirmTransactionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BalancePage,
    TransactionsPage,
    TransferPage,
    AccountPage,
    SignupPage,
    LoginPage,
    ConfirmTransactionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NemProvider
  ]
})
export class AppModule {}