import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import CryptoJS from 'crypto-js';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import * as nemSdk from "nem-sdk";
import {NEMLibrary, NetworkTypes, SimpleWallet, Password, Address, Account, AccountHttp, MosaicHttp, AccountOwnedMosaicsService, MosaicTransferable} from "nem-library";

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
    accountOwnedMosaicsSerivce: AccountOwnedMosaicsService

    constructor(private storage: Storage) {
        NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
        this.accountHttp = new AccountHttp();
        this.mosaicHttp = new MosaicHttp();
        this.accountOwnedMosaicsSerivce = new AccountOwnedMosaicsService(this.accountHttp, this.mosaicHttp);
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

    public formatAddress(address) { // From TBMVIOVCN3ZQJDSLR2MPOH3LEVPIPULZPUQVBOVE to TBMVIO-VCN3ZQ-JDSLR2-MPOH3-LEVPI-PULZPU-QVBOVE
        return this.nem.default.utils.format.address(address);
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
                result.push(wallet); // TODO: format old wallets to new format
                result = result.map(_ => _.writeWLTFile());
                console.log("write");
                console.log(result);
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
                result = JSON.parse(data).map(walletFile => SimpleWallet.readFromWLT(walletFile));
            }
            return result;
        });
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

    public checkAddress(privateKey: string, address: Address) {
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

    // TODO: remove
    /**
     * Given an iterator and a node list.it returns a the endpoint.
     * Uri if the node is alive, or it is called again with a different node.
     * @param iterator node index to test
     * @param nodes node list to try
     * @port for creating endpoint
     */
    private _getAvailableNodeFromNodeList(iterator, nodes, port){
        var result = "";

        //start testing first node
        var node = nodes[iterator];

        var endpoint = this.nem.default.model.objects.create("endpoint")(node.uri, port);

        return this.nem.default.com.requests.endpoint.heartbeat(endpoint).then(data => {
            //if success and is heart beat result
            if(data.code === 1 && data.type === 2) {
                result = node.uri;
                console.log(result);
                return result;
            }
            else {
                var iterator2 = iterator +1;
                if(iterator2 < nodes.length) return this._getAvailableNodeFromNodeList(iterator2, nodes, port);
            }
        }).catch(_ => {
            var iterator2 = iterator +1;
            if(iterator2 < nodes.length) return this._getAvailableNodeFromNodeList(iterator2, nodes, port);
        });
    }

    // TODO: remove
    /**
     * Given an network id, it retrieves its port.
     * @param network network to provide port
     * @param nodes node list to try
     */
    private _getDefaultPort(network){
        //If mijin
        if(network == 96){
            return this.nem.default.model.nodes.mijinPort;
        }
        else{
            return this.nem.default.model.nodes.defaultPort;
        }
    }

    // TODO: remove
    /**
     * Given a network id, it provides an alive node
     * @param network mosaic namespace
     * @return Promise with default node
     */
    private _provideDefaultNode(network){
        var defaultNode;
        let defaultPort = this._getDefaultPort(network);
        var nodes;

        if(network == -104){
            nodes = this.nem.default.model.nodes.testnet;
        }
        else if (network == 104){
            nodes = this.nem.default.model.nodes.mainnet;
        }
        else if (network == 96){
            nodes = this.nem.default.model.nodes.mijin;
        }
        defaultNode =  this._getAvailableNodeFromNodeList(0, nodes, defaultPort);
        return defaultNode;
    }

    // REMOVE
    /**
     * Given a mosaic, it returns its definition
     * @param mosaicNamespaceId mosaic namespace
     * @param mosaicId mosaic name
     * @param selected network
     * @return Promise with mosaic definition
     */
    public getMosaicsMetaDataPair(mosaicNamespaceId, mosaicId, network) {

        // init endpoint
        return this._provideDefaultNode(network).then(node => {

            var endpoint = this.nem.default.model.objects.create("endpoint")(node, this._getDefaultPort(network));

            var mosaicDefinitionMetaDataPair = this.nem.default.model.objects.get("mosaicDefinitionMetaDataPair");

            return this.nem.default.com.requests.namespace.mosaicDefinitions(endpoint, mosaicNamespaceId).then(
                value => {
                    // Look for the mosaic definition(s) we want in the request response (Could use ["eur", "usd"] to return eur and usd mosaicDefinitionMetaDataPairs)
                    var neededDefinition = this.nem.default.utils.helpers.searchMosaicDefinitionArray(value, [mosaicId]);

                    // Get full name of mosaic to use as object key
                    var fullMosaicName = mosaicNamespaceId + ':' + mosaicId;

                    // Check if the mosaic was found
                    if (undefined === neededDefinition[fullMosaicName]) {
                        //return xem definition
                        return mosaicDefinitionMetaDataPair;
                    }
                    // Set mosaic definition into mosaicDefinitionMetaDataPair
                    mosaicDefinitionMetaDataPair[fullMosaicName] = {};
                    mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];

                    return mosaicDefinitionMetaDataPair;
                }
            );
        });
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
     * @return Promise containing prepared transaction
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
        return this._provideDefaultNode(network).then(node => {
            var endpoint = this.nem.default.model.objects.create("endpoint")(node, this._getDefaultPort(network));
            return this.nem.default.model.transactions.send(common, transactionEntity, endpoint);
        })
    }

    /**
     * Adds to a transaction data mosaic definitions
     * @param transactions transactions object
     * @param selected Network
     * @return Promise with altered transaction
     */
    public addDefinitionToMosaics(mosaics, network) {
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
     * Returns if transaction has at least one mosaic with levy
     * @param array of mosaics
     * @return Boolean indicating the result
     */

    public transactionHasAtLeastOneMosaicWithLevy(mosaics){
        var i = 0;
        var result = false;

        while (i < mosaics.length && !result){
            if(mosaics[i].definition.levy.mosaicId){
                result = true;
            }
            ++i;
        }
        return result;
    }


    /**
     * Get all confirmed transactions of an account
     * @param address account Address
     * @param selected Network
     * @return Promise with account transactions
     */
    public getAllTransactionsFromAnAccount(address, network) {
        return this._provideDefaultNode(network).then(node => {

            var endpoint = this.nem.default.model.objects.create("endpoint")(node, this._getDefaultPort(network));

            return this.nem.default.com.requests.account.allTransactions(endpoint, address);

        });
    }

    /**
     * Get all unconfirmed transactions of an account
     * @param address account Address
     * @param selected Network
     * @return Promise with account transactions
     */
    public getUnconfirmedTransactionsFromAnAccount(address, network) {
        return this._provideDefaultNode(network).then(node => {

            var endpoint = this.nem.default.model.objects.create("endpoint")(node, this._getDefaultPort(network));
            return this.nem.default.com.requests.account.unconfirmedTransactions(endpoint, address);

        });
    }
}
