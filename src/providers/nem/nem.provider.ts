import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import CryptoJS from 'crypto-js';
import {LocalDateTime} from "js-joda";
import {Base64} from "js-base64";

import * as nemSdk from "nem-sdk";
import {
    NEMLibrary, NetworkTypes, SimpleWallet, 
    Password, Address, Account, AccountHttp, 
    MosaicHttp, AccountOwnedMosaicsService, 
    MosaicTransferable, TransferTransaction,
    TimeWindow, XEM, PlainMessage,
    TransactionHttp, NemAnnounceResult,
    Transaction, Mosaic, MosaicService 
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
    nem: any;
    accountHttp: AccountHttp;
    mosaicHttp: MosaicHttp;
    transactionHttp: TransactionHttp;
    accountOwnedMosaicsSerivce: AccountOwnedMosaicsService

    constructor(private storage: Storage) {
        NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
        this.accountHttp = new AccountHttp();
        this.mosaicHttp = new MosaicHttp();
        this.transactionHttp = new TransactionHttp();

        this.accountOwnedMosaicsSerivce = new AccountOwnedMosaicsService(this.accountHttp, this.mosaicHttp);
        this.nem = nemSdk;
    }

    /**
     * Store wallet
     * @param wallet
     * @return Promise with stored wallet
     */
    private _storeWallet(wallet: SimpleWallet): Promise<SimpleWallet> {
        var result = [];
        return this.getWallets().then(
            value => {
                result = value;
                result.push(wallet);
                result = result.map(_ => _.writeWLTFile());
                this.storage.set('wallets', JSON.stringify(result));
                return wallet;
            }
        )
    }

    //Wallets

    /**
     * Check If Wallet Name Exists
     * @param walletName
     * @return Promise that resolves a boolean if exists
     */
    private _checkIfWalletNameExists(walletName): Promise<boolean> {
        var exists = false;

        return this.getWallets().then(
            value => {
                var wallets = value || [];
                for (var i = 0; i < wallets.length; i++) {
                    if (wallets[i].name == walletName) {
                        exists = true;
                        break;
                    }
                }
                return exists;
            }
        )
    }

    /**
     * Retrieves selected wallet
     * @return promise with selected wallet
     */
    public getSelectedWallet(): Promise<SimpleWallet> {
        return this.storage.get('selectedWallet').then(data => {
            var result = null;
            if (data) {
                result = SimpleWallet.readFromWLT(JSON.parse(data));
            }
            return result;
        });
    }

    /**
     * Get loaded wallets from localStorage
     */
    public getWallets(): Promise<SimpleWallet[]> {
        return this.storage.get('wallets').then(data => {
            var result = [];
            if (data) {
                console.log(data);
                result = JSON.parse(data).map(walletFile => {
                    if (walletFile.name) {
                        return this.convertJSONWalletToFileWallet(walletFile); 
                    }else {
                        return SimpleWallet.readFromWLT(walletFile);
                    }
                });
            }
            return result;
        });
    }

    private convertJSONWalletToFileWallet(wallet): SimpleWallet {
        let walletString = Base64.encode(JSON.stringify({
            "address": wallet.accounts[0].address,
            "creationDate": LocalDateTime.now().toString(),
            "encryptedPrivateKey": wallet.accounts[0].encrypted,
            "iv": wallet.accounts[0].iv,
            "network": wallet.accounts[0].network == -104 ? NetworkTypes.TEST_NET : NetworkTypes.MAIN_NET,
            "name": wallet.name,
            "type": "simple",
            "schema": 1
          }));
        return SimpleWallet.readFromWLT(walletString);
    }

    /**
     * Set a selected wallet
     */
    public setSelectedWallet(wallet: SimpleWallet) {
        this.storage.set('selectedWallet', JSON.stringify(wallet.writeWLTFile()));
    }

    /**
     * Remove selected Wallet
     */
    public unsetSelectedWallet() {
        this.storage.set('selectedWallet', null);
    }

    /**
     * Create Simple Wallet
     * @param walletName wallet idenitifier for app
     * @param password wallet's password
     * @param selected network
     * @return Promise with wallet created
     */
    public createSimpleWallet(walletName: string, password: string): Promise<SimpleWallet> {
        let wallet = SimpleWallet.create(walletName, new Password(password));
        return this._checkIfWalletNameExists(walletName).then(
            value => {
                if (value) {
                    return null;
                }
                else {
                    return this._storeWallet(wallet).then(
                        value => {
                            return value;
                        }
                    )
                }
            }
        )
    }

    /**
     * Create Wallet from private key
     * @param walletName wallet idenitifier for app
     * @param password wallet's password
     * @param privateKey account privateKey
     * @param selected network
     * * @return Promise with wallet created
     */
    public createPrivateKeyWallet(walletName, password, privateKey) {
        let wallet = SimpleWallet.createWithPrivateKey(walletName, new Password(password), privateKey);
        return this._checkIfWalletNameExists(walletName).then(
            value => {
                if (value) {
                    return null;
                }
                else {
                    return this._storeWallet(wallet).then(
                        value => {
                            return value;
                        }
                    )
                }
            }
        )
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
     * @param common sensitive data
     * @param wallet
     * @return promise with selected wallet
     */
    public passwordToPrivateKey(common, wallet: SimpleWallet) {
        return this.nem.default.crypto.helpers.passwordToPrivatekey(common, {
            "iv": wallet.encryptedPrivateKey.iv,
            "encrypted": wallet.encryptedPrivateKey.encryptedKey
        }, "pass:bip32");
    }
    /**
     * Decrypt private key
     * @param password password
     * @param encriptedData Object containing private_key encrypted and salt
     * @return Decrypted private key
     */

    public decryptPrivateKey(password, encriptedData){
        let salt = CryptoJS.enc.Hex.parse(encriptedData.salt);
        let encrypted = encriptedData.priv_key;

        //generate key
        let key = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 2000
        }).toString();

        //separated from priv_key iv and cipherdata
        let iv = encrypted.substring(0, 32);
        let encryptedPrvKey = encrypted.substring(32, 128);

        //separated  vh from priv_key iv and cipherdata
        let obj = {
            ciphertext: CryptoJS.enc.Hex.parse(encryptedPrvKey),
            iv: this.nem.default.utils.convert.hex2ua(iv),
            key: this.nem.default.utils.convert.hex2ua(key.toString())
        }
        return Promise.resolve(this.nem.default.crypto.helpers.decrypt(obj));
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
