import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule} from '@angular/http'
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Clipboard} from '@ionic-native/clipboard';
import {Keyboard} from '@ionic-native/keyboard';
import { SQLite } from '@ionic-native/sqlite';
import { AppVersion } from '@ionic-native/app-version';

import {SocialSharing} from '@ionic-native/social-sharing';
import {Network} from '@ionic-native/network';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization';

import {AlertProvider} from '../providers/alert/alert.provider';
import {ToastProvider} from '../providers/toast/toast.provider';
import {NemProvider} from '../providers/nem/nem.provider';
import {WalletProvider} from '../providers/wallet/wallet.provider';
import {ContactProvider} from '../providers/contact/contact.provider';
import {LanguageProvider} from '../providers/language/language.provider';


import {DivideByExponentialBaseTenPipe} from '../pipes/divide-by-exponential-base-ten.pipe';
import {FormatLevyPipe} from '../pipes/format-levy.pipe';
import {SearchContactPipe} from '../pipes/search-contact.pipe';

import {MyApp} from './app.component';
import {BalancePage} from '../pages/balance/balance';
import {TransactionsPage} from '../pages/transactions/transactions';
import {TransferPage} from '../pages/transfer/transfer';
import {ReceivePage} from '../pages/receive/receive';
import {TransactionsConfirmedPage} from '../pages/transactions_confirmed/transactions';
import {TransactionsUnconfirmedPage} from '../pages/transactions_unconfirmed/transactions';
import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {SignupSimpleWalletPage} from '../pages/signup_simplewallet/signup';
import {SignupPrivateKeyPage} from '../pages/signup_privatekey/signup';

import {ContactListPage} from '../pages/contact/list/list';
import {UpdateContactPage} from '../pages/contact/update/update';

import {ImportanceTransferTransactionComponent} from '../pages/transactions/partials/importance-transfer-transaction/importance-transfer-transaction';
import {MosaicDefinitionTransactionComponent} from '../pages/transactions/partials/mosaic-definition-transaction/mosaic-definition-transaction';
import {MosaicSupplyChangeTransactionComponent} from '../pages/transactions/partials/mosaic-supply-change-transaction/mosaic-supply-change-transaction';
import {MultisigTransactionComponent} from '../pages/transactions/partials/multisig-transaction/multisig-transaction';
import {ProvisionNamespaceTransactionComponent} from '../pages/transactions/partials/provision-namespace-transaction/provision-namespace-transaction';
import {TransferTransactionComponent} from '../pages/transactions/partials/transfer-transaction/transfer-transaction';
import {MultisigAggregateModificationTransactionComponent} from '../pages/transactions/partials/multisig-aggregate-modification-transaction/multisig-aggregate-modification-transaction';



export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp,
        ContactListPage,
        UpdateContactPage,
        BalancePage,
        TransactionsPage,
        TransferPage,
        ReceivePage,
        AccountPage,
        LoginPage,
        SignupPage,
        SignupSimpleWalletPage,
        SignupPrivateKeyPage,
        TransactionsConfirmedPage,
        TransactionsUnconfirmedPage,
        ImportanceTransferTransactionComponent,
        MosaicDefinitionTransactionComponent,
        MosaicSupplyChangeTransactionComponent,
        MultisigTransactionComponent,
        ProvisionNamespaceTransactionComponent,
        TransferTransactionComponent,
        MultisigAggregateModificationTransactionComponent,
        DivideByExponentialBaseTenPipe,
        FormatLevyPipe,
        SearchContactPipe
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        })

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ContactListPage,
        UpdateContactPage,
        BalancePage,
        TransactionsPage,
        TransferPage,
        ReceivePage,
        TransactionsConfirmedPage,
        TransactionsUnconfirmedPage,
        AccountPage,
        LoginPage,
        SignupPage,
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
        Globalization,
        SQLite,
        AppVersion,
        NemProvider,
        WalletProvider,
        AlertProvider,
        ToastProvider,
        ContactProvider,
        LanguageProvider
    ]
})
export class AppModule {
}