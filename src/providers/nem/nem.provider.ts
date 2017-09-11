import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {
    NEMLibrary, NetworkTypes, SimpleWallet, 
    Password, Address, Account, AccountHttp, 
    MosaicHttp, AccountOwnedMosaicsService, 
    MosaicTransferable, TransferTransaction,
    TimeWindow, XEM, PlainMessage,
    TransactionHttp, NemAnnounceResult,
    Transaction, Mosaic, MosaicService, 
    QRService, QRWalletText  
} from "nem-library";

import { Observable } from "nem-library/node_modules/rxjs";

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class NemProvider {
    wallets: SimpleWallet[];
    accountHttp: AccountHttp;
    mosaicHttp: MosaicHttp;
    transactionHttp: TransactionHttp;
    qrService: QRService;
    accountOwnedMosaicsSerivce: AccountOwnedMosaicsService

    constructor(private storage: Storage) {
        NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
        this.accountHttp = new AccountHttp();
        this.mosaicHttp = new MosaicHttp();
        this.transactionHttp = new TransactionHttp();
        this.qrService = new QRService();
        this.accountOwnedMosaicsSerivce = new AccountOwnedMosaicsService(this.accountHttp, this.mosaicHttp);
    }

    /**
     * Create Simple Wallet
     * @param walletName wallet idenitifier for app
     * @param password wallet's password
     * @param selected network
     * @return Promise with wallet created
     */
    public createSimpleWallet(walletName: string, password: string): SimpleWallet {
        return SimpleWallet.create(walletName, new Password(password));
    }

    /**
     * Create Wallet from private key
     * @param walletName wallet idenitifier for app
     * @param password wallet's password
     * @param privateKey account privateKey
     * @param selected network
     * * @return Promise with wallet created
     */
    public createPrivateKeyWallet(walletName, password, privateKey): SimpleWallet {
        return SimpleWallet.createWithPrivateKey(walletName, new Password(password), privateKey);
    }


    /**
     * Check if Address it is correct
     * @param privateKey privateKey
     * @param address address
     * @return checkAddress
     */

    public checkAddress(privateKey: string, address: Address): boolean {
        return Account.createWithPrivateKey(privateKey).address.plain() == address.plain();
    }

    /**
     * Gets private key from password and account
     * @param password
     * @param wallet
     * @return promise with selected wallet
     */
    public passwordToPrivateKey(password: string, wallet: SimpleWallet): string {
        return wallet.unlockPrivateKey(new Password(password));
    }

    /**
     * Decrypt private key
     * @param password password
     * @param encriptedData Object containing private_key encrypted and salt
     * @return Decrypted private key
     */

    public decryptPrivateKey(password: string, encriptedData: QRWalletText): string {
        return this.qrService.decryptWalletQRText(new Password(password), encriptedData);
    }

    /**
     * Generate Address QR Text
     * @param address address
     * @return Address QR Text
     */
    public generateAddressQRText(address: Address): string {
        return this.qrService.generateAddressQRText(address);
    }

    /**
     * Generate Address QR Text
     * @param address address
     * @return Address QR Text
     */
    public generateInvoiceQRText(address: Address, amount:number, message: string): string {
        return this.qrService.generateTransactionQRText(address, amount, message);
    }


    /**
     * Get mosaics form an account
     * @param address address to check balance
     * @return Promise with mosaics information
     */
    public getBalance(address: Address): Promise<MosaicTransferable[]> {
        return this.accountOwnedMosaicsSerivce.fromAddress(address).toPromise();
    }

    /**
     * Formats levy given mosaic object
     * @param mosaic mosaic object
     * @return Promise with levy fee formated
     */
    public formatLevy(mosaic: MosaicTransferable): Promise<number> {
        let mosaicService = new MosaicService(new MosaicHttp());
        return mosaicService.calculateLevy(mosaic).toPromise()
    }

    /**
     * Check if acount belongs to the current Network
     * @param address address to check
     * @return Return prepared transaction
     */
    public isFromNetwork(address: Address): boolean  {
        return address.network() == NEMLibrary.getNetworkType();
    }

    /**
     * Prepares xem transaction
     * @param recipientAddress recipientAddress
     * @param amount amount
     * @param message message
     * @return Return transfer transaction
     */
    public prepareTransaction(recipientAddress: Address, amount: number, message: string): TransferTransaction {
        return TransferTransaction.create(TimeWindow.createWithDeadline(), recipientAddress, new XEM(amount), PlainMessage.create(message));
    }

    /**
     * Prepares mosaic transaction
     * @param recipientAddress recipientAddress
     * @param mosaicsTransferable mosaicsTransferable
     * @param message message
     * @return Promise containing prepared transaction
     */
    public prepareMosaicTransaction(recipientAddress: Address, mosaicsTransferable: MosaicTransferable[], message: string): TransferTransaction {        
        return TransferTransaction.createWithMosaics(TimeWindow.createWithDeadline(), recipientAddress, mosaicsTransferable, PlainMessage.create(message));        
    }

    /**
     * Send transaction into the blockchain
     * @param transferTransaction transferTransaction
     * @param password wallet
     * @param password password
     * @return Promise containing sent transaction
     */
    public confirmTransaction(transferTransaction: TransferTransaction, wallet: SimpleWallet, password: string): Observable<NemAnnounceResult> {
        let account = wallet.open(new Password(password));
        let signedTransaction = account.signTransaction(transferTransaction);
        return this.transactionHttp.announceTransaction(signedTransaction);
    }

    /**
     * Adds to a transaction data mosaic definitions
     * @param mosaics array of mosaics
     * @return Promise with altered transaction
     */
    public addDefinitionToMosaics(mosaics: Mosaic[]): Observable<MosaicTransferable[]> {
        return Observable.from(mosaics)
        .flatMap((mosaic: Mosaic) => {
            if (XEM.MOSAICID.equals(mosaic.mosaicId)) return Observable.of(new XEM(mosaic.quantity / Math.pow(10, XEM.DIVISIBILITY)));
            else {
              return this.mosaicHttp.getMosaicDefinition(mosaic.mosaicId).map(mosaicDefinition => {
                return MosaicTransferable.createWithMosaicDefinition(mosaicDefinition, mosaic.quantity / Math.pow(10, mosaicDefinition.properties.divisibility));
              });
            }
          })
          .toArray();
    }


    /**
     * Returns if transaction has at least one mosaic with levy
     * @param mosaics array of mosaics
     * @return Boolean indicating the result
     */

    public transactionHasAtLeastOneMosaicWithLevy(mosaics: MosaicTransferable[]): boolean{
        var hasLevy = false;
        mosaics.filter(mosaic => {
            if (mosaic.levy) hasLevy = true; 
        });
        return hasLevy;
    }


    /**
     * Get all confirmed transactions of an account
     * @param address account Address
     * @return Promise with account transactions
     */
    public getAllTransactionsFromAnAccount(address: Address): Observable<Transaction[]> {
        return this.accountHttp.allTransactions(address);
    }

    /**
     * Get all unconfirmed transactions of an account
     * @param address account Address
     * @return Promise with account transactions
     */
    public getUnconfirmedTransactionsFromAnAccount(address: Address): Observable<Transaction[]> {
        return this.accountHttp.unconfirmedTransactions(address);
    }
}
