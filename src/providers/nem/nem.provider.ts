import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import * as nemSdk from "nem-sdk";

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class NemProvider {
    nem: any;
    wallets: any;

    constructor(private storage: Storage) {
        this.nem = nemSdk;
    }

    /* Filters */

    public hexMessage(msg) {
        return this.nem.default.utils.format.hexMessage(msg);
    }

    public pubToAddress(pub, network) {
        return this.nem.default.utils.format.pubToAddress(pub, network);
    }

    public nemDate(nemDate) {
        return this.nem.default.utils.format.nemDate(nemDate);
    }

    public formatAddress(address) {
        return this.nem.default.utils.format.address(address);
    }

    /**
     * Store wallet
     * @param wallet
     * @return Promise with stored wallet
     */
    private _storeWallet(wallet): any {
        var result = [];
        return this.getWallets().then(
            value => {
                result = value;
                result.push(wallet);
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
    private _checkIfWalletNameExists(walletName): any {
        var exists = false;

        return this.getWallets().then(
            value => {
                var result = value || [];

                for (var i = 0; i < result.length; i++) {
                    if (result[i].name == walletName) {
                        exists = true;
                        break;
                    }
                }
                return exists;
            }
        )
    }

    /**
     * Check if Address it is correct
     * @param privateKey privateKey
     * @param network account network
     * @param address address
     * @return checkAddress
     */

    public checkAddress(privateKey, network, address) {
        return this.nem.default.crypto.helpers.checkAddress(privateKey, network, address);
    }

    /**
     * Gets private key from password and account
     * @param common sensitive data
     * @param account account
     * @param algo
     * @return promise with selected wallet
     */
    public passwordToPrivateKey(common, account, algo) {
        return this.nem.default.crypto.helpers.passwordToPrivatekey(common, account, algo);
    }

    /**
     * Retrieves selected wallet
     * @return promise with selected wallet
     */
    public getSelectedWallet(): any {
        return this.storage.get('selectedWallet').then(data => {
            var result = null;
            if (data) {
                result = JSON.parse(data);
            }
            return result;
        });
    }

    /**
     * Get loaded wallets from localStorage
     */
    public getWallets(): any {
        return this.storage.get('wallets').then(data => {
            var result = [];
            if (data) {
                result = JSON.parse(data);
            }
            return result;
        });
    }

    /**
     * Set a selected wallet
     */
    public setSelectedWallet(wallet) {
        this.storage.set('selectedWallet', JSON.stringify(wallet));
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
    public createSimpleWallet(walletName, password, network) {
        let wallet = this.nem.default.model.wallet.createPRNG(walletName, password, network);
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
    public createPrivateKeyWallet(walletName, password, privateKey, network) {
        //TODO: make able to choose netwok
        let wallet = this.nem.default.model.wallet.importPrivateKey(walletName, password, privateKey, network);
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


    // NEM


    private _provideDefaultNode(network){
        var defaultNode = "";
        if(network == -104){
            defaultNode = this.nem.default.model.nodes.defaultTestnet
        }
        else if (network == 104){

            defaultNode = this.nem.default.model.nodes.defaultMainnet;
        }

        else if (network == 96){
            defaultNode = this.nem.default.model.nodes.defaultMijin;
        }
        return defaultNode;

    }
    /**
     * Given a mosaic, it returns its definition
     * @param mosaicNamespaceId mosaic namespace
     * @param mosaicId mosaic name
     * @param selected network
     * @return Promise with mosaic definition
     */
    public getMosaicsMetaDataPair(mosaicNamespaceId, mosaicId, network) {

        // init endpoint
        var endpoint = this.nem.default.model.objects.create("endpoint")(this._provideDefaultNode(network), this.nem.default.model.nodes.defaultPort);

        var mosaicDefinitionMetaDataPair = this.nem.default.model.objects.get("mosaicDefinitionMetaDataPair");

        return this.nem.default.com.requests.namespace.mosaicDefinitions(endpoint, mosaicNamespaceId).then(
            value => {
                // Look for the mosaic definition(s) we want in the request response (Could use ["eur", "usd"] to return eur and usd mosaicDefinitionMetaDataPairs)
                var neededDefinition = this.nem.default.utils.helpers.searchMosaicDefinitionArray(value, [mosaicId]);

                // Get full name of mosaic to use as object key
                var fullMosaicName = mosaicNamespaceId + ':' + mosaicId;

                // Check if the mosaic was found
                if (undefined === neededDefinition[fullMosaicName]) {
                    console.error("Mosaic not found !");
                    return mosaicDefinitionMetaDataPair;
                }
                // Set mosaic definition into mosaicDefinitionMetaDataPair
                mosaicDefinitionMetaDataPair[fullMosaicName] = {};
                mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];

                return mosaicDefinitionMetaDataPair;
            }
        );
    }

    /**
     * Adds mosaic information to balance mosaics
     * @param balance array of mosaics
     * @param network selected network
     * @return Promise with altered balance
     */
    private _addDivisibilityToBalance(balance, network) {
        var promises = [];

        for (let mosaic of balance.data) {
            promises.push(this.getMosaicsMetaDataPair(mosaic.mosaicId.namespaceId, mosaic.mosaicId.name, network));
        }

        return Promise.all(promises).then(values => {
                var i = 0;
                for (let mosaic of balance.data) {
                    mosaic.definition = values[i][mosaic.mosaicId.namespaceId + ':' + mosaic.mosaicId.name].mosaicDefinition;
                    ++i;
                }
                return balance;
            }
        );
    }

    /**
     * Get mosaics form an account
     * @param address address to check balance
     * @param network selected network
     * @return Promise with mosaics information
     */
    public getBalance(address, network) {
        var endpoint = this.nem.default.model.objects.create("endpoint")(this._provideDefaultNode(network), this.nem.default.model.nodes.defaultPort);
        // Gets account data
        return this.nem.default.com.requests.account.mosaics(endpoint, address).then(
            value => {
                return this._addDivisibilityToBalance(value, network);
            }
        ).catch(error => {
            return false;
        })
    }

    /**
     * Formats levy given mosaic object
     * @param mosaic mosaic object
     * @param multiplier 1 by default
     * @param levy levy object
     * @return Promise with levy fee formated
     */
    public formatLevy(mosaic, multiplier, levy, network) {
        this.nem.default.model.objects.get("mosaicDefinitionMetaDataPair");
        return Promise.all([this.getMosaicsMetaDataPair(mosaic.mosaicId.namespaceId, mosaic.mosaicId.name, network), this.getMosaicsMetaDataPair(levy.mosaicId.namespaceId, levy.mosaicId.name, network)]).then(values => {
            var mosaicDefinitionMetaDataPair = values[0];
            mosaicDefinitionMetaDataPair[levy.mosaicId.namespaceId + ':' + levy.mosaicId.name] = values[1][levy.mosaicId.namespaceId + ':' + levy.mosaicId.name];
            return this.nem.default.utils.format.levyFee(mosaic, multiplier, levy, mosaicDefinitionMetaDataPair);

        });
    }

    /**
     * Check if acount belongs to the current Network
     * @param address address to check
     * @param formData transaction definition object
     * @param network sselectedNetwork
     * @return Return prepared transaction
     */
    public isFromNetwork(address, network) {
        return this.nem.default.model.address.isFromNetwork(address, network);
    }

    /**
     * Prepares xem transaction
     * @param common sensitive data
     * @param formData transaction definition object
     * @param selected Network
     * @return Return prepared transaction
     */
    public prepareTransaction(common, formData, network) {
        // Create transfer transaction
        var transferTransaction = this.nem.default.model.objects.create("transferTransaction")(formData.recipient, formData.amount, formData.message);

        return this.nem.default.model.transactions.prepare("transferTransaction")(common, transferTransaction, network);

    }

    /**
     * Prepares mosaic transaction
     * @param common sensitive data
     * @param formData transaction definition object
     * @param selected Network
     * @return Promise containing prepared transacton
     */
    public prepareMosaicTransaction(common, formData, network) {
        // Create transfer transaction
        var transferTransaction = this.nem.default.model.objects.create("transferTransaction")(formData.recipient, formData.amount, formData.message);

        let mosaicAttachment = this.nem.default.model.objects.create("mosaicAttachment")(formData.mosaics[0].mosaicId.namespaceId, formData.mosaics[0].mosaicId.name, formData.mosaics[0].quantity);
        transferTransaction.mosaics.push(mosaicAttachment);

        return this.getMosaicsMetaDataPair(formData.mosaics[0].mosaicId.namespaceId, formData.mosaics[0].mosaicId.name, network).then(value => {
            return this.nem.default.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, value, network);
        })
    }

    /**
     * Send transaction into the blockchain
     * @param common sensitive data
     * @param transactionEntity transaction to send
     * @param selected Network
     * @return Promise containing sent transaction
     */
    public confirmTransaction(common, transactionEntity, network) {
        var endpoint = this.nem.default.model.objects.create("endpoint")(this._provideDefaultNode(network), this.nem.default.model.nodes.defaultPort);
        return this.nem.default.model.transactions.send(common, transactionEntity, endpoint);
    }

    /**
     * Adds to a transaction data mosaic definitions
     * @param transactions transactions object
     * @param selected Network
     * @return Promise with altered transaction
     */
    private _addDivisibilityToTransaction(mosaics, network) {
        var promises = [];

        for (let mosaic of mosaics) {
            promises.push(this.getMosaicsMetaDataPair(mosaic.mosaicId.namespaceId, mosaic.mosaicId.name, network));
        }

        return Promise.all(promises).then(values => {
                var i = 0;
                for (let mosaic of mosaics) {
                    mosaic.definition = values[i][mosaic.mosaicId.namespaceId + ':' + mosaic.mosaicId.name].mosaicDefinition;
                    ++i;
                }
                return mosaics;
            }
        );
    }

    /**
     * Adds to transactions data mosaic definitions
     * @param transactions Array of transactions object
     * @param selected Network
     * @return Promise with altered transactions
     */
    private _adaptTransactions(transactions, network) {
        var promises = [];

        for (let tx of transactions) {
            if (tx.transaction.mosaics) {
                promises.push(this._addDivisibilityToTransaction(tx.transaction.mosaics, network));
            }
        }

        return Promise.all(promises).then(values => {
            var i = 0;

            for (let tx of transactions) {
                if (tx.transaction.mosaics) {
                    tx.transaction.mosaics = values[i];
                    ++i;
                }
            }
            return transactions;
        });
    }

    /**
     * Get all confirmed transactions of an account
     * @param address account Address
     * @param selected Network
     * @return Promise with account transactions
     */
    public getAllTransactionsFromAnAccount(address, network) {
        var endpoint = this.nem.default.model.objects.create("endpoint")(this._provideDefaultNode(network), this.nem.default.model.nodes.defaultPort);

        return this.nem.default.com.requests.account.allTransactions(endpoint, address).then(value => {
            return this._adaptTransactions(value, network);
        });
    }

    /**
     * Get all unconfirmed transactions of an account
     * @param address account Address
     * @param selected Network
     * @return Promise with account transactions
     */
    public getUnconfirmedTransactionsFromAnAccount(address, network) {
        var endpoint = this.nem.default.model.objects.create("endpoint")(this._provideDefaultNode(network), this.nem.default.model.nodes.defaultPort);
        return this.nem.default.com.requests.account.unconfirmedTransactions(endpoint, address).then(value => {
            return this._adaptTransactions(value, network);
        });
    }
}
