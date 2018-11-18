/*
 * MIT License
 *
 * Copyright (c) 2017 David Garcia <dgarcia360@outlook.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule} from '@angular/http'
import {ReactiveFormsModule} from '@angular/forms';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Clipboard} from '@ionic-native/clipboard';
import {Keyboard} from '@ionic-native/keyboard';
import {SQLite} from '@ionic-native/sqlite';
import {AppVersion} from '@ionic-native/app-version';
import {SocialSharing} from '@ionic-native/social-sharing';
import {Network} from '@ionic-native/network';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Globalization} from '@ionic-native/globalization';
import {AlertProvider} from '../providers/alert/alert.provider';
import {ToastProvider} from '../providers/toast/toast.provider';
import {NemUtils} from '../providers/nem/nem.utils';
import {WalletProvider} from '../providers/wallet/wallet.provider';
import {ContactProvider} from '../providers/contact/contact.provider';
import {LanguageProvider} from '../providers/language/language.provider';
import {DivideByExponentialBaseTenPipe} from '../pipes/divide-by-exponential-base-ten.pipe';
import {FormatLevyPipe} from '../pipes/format-levy.pipe';
import {FormatXEMPipe} from "../pipes/format-XEM";
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
        FormatXEMPipe,
        SearchContactPipe
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
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
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        SocialSharing,
        Clipboard,
        Keyboard,
        Network,
        BarcodeScanner,
        Globalization,
        SQLite,
        AppVersion,
        NemUtils,
        WalletProvider,
        AlertProvider,
        ToastProvider,
        ContactProvider,
        LanguageProvider
    ]
})
export class AppModule {
}