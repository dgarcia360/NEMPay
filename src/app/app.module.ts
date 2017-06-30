import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Clipboard} from '@ionic-native/clipboard';
import {Keyboard} from '@ionic-native/keyboard';

import {SocialSharing} from '@ionic-native/social-sharing';
import {Network} from '@ionic-native/network';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';


import {AlertProvider} from '../providers/alert/alert.provider';
import {ToastProvider} from '../providers/toast/toast.provider';
import {NemProvider} from '../providers/nem/nem.provider';


import {DivideByExponentialBaseTenPipe} from '../pipes/divide-by-exponential-base-ten.pipe';
import {HexMessageToStringPipe} from '../pipes/hex-message-to-string.pipe';
import {PubToAddressPipe} from '../pipes/pub-to-address.pipe';
import {NemDatePipe} from '../pipes/nem-date.pipe';
import {FormatAddressPipe} from '../pipes/format-address.pipe';
import {FormatLevyPipe} from '../pipes/format-levy.pipe';
import {MyApp} from './app.component';
import {BalancePage} from '../pages/balance/balance';
import {TransactionsPage} from '../pages/transactions/transactions';
import {TransferPage} from '../pages/transfer/transfer';
import {TransactionsConfirmedPage} from '../pages/transactions_confirmed/transactions';
import {TransactionsUnconfirmedPage} from '../pages/transactions_unconfirmed/transactions';
import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {SignupBrainWalletPage} from '../pages/signup_brainwallet/signup';
import {SignupSimpleWalletPage} from '../pages/signup_simplewallet/signup';
import {SignupPrivateKeyPage} from '../pages/signup_privatekey/signup';


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

        DivideByExponentialBaseTenPipe,
        HexMessageToStringPipe,
        PubToAddressPipe,
        NemDatePipe,
        FormatAddressPipe,
        FormatLevyPipe,
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
        TransactionsConfirmedPage,
        TransactionsUnconfirmedPage,
        AccountPage,
        LoginPage,
        SignupPage,
        SignupBrainWalletPage,
        SignupSimpleWalletPage,
        SignupPrivateKeyPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        SocialSharing,
        Clipboard,
        Keyboard,
        Network,
        BarcodeScanner,
        NemProvider,
        AlertProvider,
        ToastProvider
    ]
})
export class AppModule {
}