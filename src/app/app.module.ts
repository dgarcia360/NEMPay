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
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SignupBrainWalletPage } from '../pages/signup_brainwallet/signup';
import { SignupSimpleWalletPage } from '../pages/signup_simplewallet/signup';
import { SignupPrivateKeyPage } from '../pages/signup_privatekey/signup';
import { TransactionsConfirmedPage } from '../pages/transactions_confirmed/transactions';
import { TransactionsUnconfirmedPage } from '../pages/transactions_unconfirmed/transactions';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NemProvider } from '../providers/nem/nem';
import { DivideByExponentialBaseTenPipe } from '../pipes/divide-by-exponential-base-ten.pipe';

@NgModule({
  declarations: [
    MyApp,
    BalancePage,
    TransactionsPage,
    TransferPage,
    AccountPage,
    LoginPage,
    SignupPage,
    SignupBrainWalletPage,
    SignupSimpleWalletPage,
    SignupPrivateKeyPage,
    TransactionsConfirmedPage,
    TransactionsUnconfirmedPage,
    DivideByExponentialBaseTenPipe
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
    LoginPage,
    SignupPage,
    SignupBrainWalletPage,
    SignupSimpleWalletPage,
    SignupPrivateKeyPage,
    TransactionsConfirmedPage,
    TransactionsUnconfirmedPage
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