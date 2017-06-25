var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import * as nemSdk from "nem-sdk";
/*
 Generated class for the NemSdkProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
var NemProvider = (function () {
    function NemProvider(storage) {
        this.storage = storage;
        this.nem = nemSdk;
        this._storage = storage;
    }
    /* Filters */
    NemProvider.prototype.hexMessage = function (msg) {
        return this.nem.default.utils.format.hexMessage(msg);
    };
    NemProvider.prototype.pubToAddress = function (pub) {
        return this.nem.default.utils.format.pubToAddress(pub);
    };
    NemProvider.prototype.nemDate = function (nemDate) {
        return this.nem.default.utils.format.nemDate(nemDate);
    };
    NemProvider.prototype.formatAddress = function (address) {
        return this.nem.default.utils.format.address(address);
    };
    /* Wallet */
    NemProvider.prototype._storeWallet = function (wallet) {
        var _this = this;
        var result = [];
        return this.getWallets().then(function (value) {
            result = value;
            result.push(wallet);
            _this._storage.set('wallets', JSON.stringify(result));
            return wallet;
        });
    };
    NemProvider.prototype._checkIfWalletNameExists = function (walletName) {
        var exists = false;
        return this.getWallets().then(function (value) {
            var result = value || [];
            for (var i = 0; i < result.length; i++) {
                if (result[i].name == walletName) {
                    exists = true;
                    break;
                }
            }
            return exists;
        });
    };
    NemProvider.prototype.checkAddress = function (privateKey, network, address) {
        return this.nem.default.crypto.helpers.checkAddress(privateKey, network, address);
    };
    NemProvider.prototype.passwordToPrivateKey = function (common, walletAccount, algo) {
        return this.nem.default.crypto.helpers.passwordToPrivatekey(common, walletAccount, algo);
    };
    NemProvider.prototype.getSelectedWallet = function () {
        return this._storage.get('selectedWallet').then(function (data) {
            var result = null;
            if (data) {
                result = JSON.parse(data);
            }
            return result;
        });
    };
    NemProvider.prototype.getWallets = function () {
        return this._storage.get('wallets').then(function (data) {
            var result = [];
            if (data) {
                result = JSON.parse(data);
            }
            return result;
        });
    };
    NemProvider.prototype.setSelectedWallet = function (wallet) {
        this._storage.set('selectedWallet', JSON.stringify(wallet));
    };
    NemProvider.prototype.unsetSelectedWallet = function () {
        this._storage.set('selectedWallet', null);
    };
    NemProvider.prototype.createSimpleWallet = function (walletName, password, network) {
        var _this = this;
        var wallet = this.nem.default.model.wallet.createPRNG(walletName, password, this.nem.default.model.network.data.testnet.id);
        return this._checkIfWalletNameExists(walletName).then(function (value) {
            if (value) {
                return null;
            }
            else {
                return _this._storeWallet(wallet).then(function (value) {
                    return value;
                });
            }
        });
    };
    NemProvider.prototype.createBrainWallet = function (walletName, password, network) {
        var _this = this;
        //TODO: make able to choose netwok
        var wallet = this.nem.default.model.wallet.createBrain(walletName, password, this.nem.default.model.network.data.testnet.id);
        return this._checkIfWalletNameExists(walletName).then(function (value) {
            if (value) {
                return null;
            }
            else {
                return _this._storeWallet(wallet).then(function (value) {
                    return value;
                });
            }
        });
    };
    NemProvider.prototype.createPrivateKeyWallet = function (walletName, password, privateKey, network) {
        var _this = this;
        //TODO: make able to choose netwok
        var wallet = this.nem.default.model.wallet.importPrivateKey(walletName, password, privateKey, this.nem.default.model.network.data.testnet.id);
        return this._checkIfWalletNameExists(walletName).then(function (value) {
            if (value) {
                return null;
            }
            else {
                return _this._storeWallet(wallet).then(function (value) {
                    return value;
                });
            }
        });
    };
    /* Balance */
    NemProvider.prototype.getMosaicsMetaDataPair = function (mosaicNamespaceId, mosaicId, original) {
        var _this = this;
        // init endpoint
        var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
        var mosaicDefinitionMetaDataPair = this.nem.default.model.objects.get("mosaicDefinitionMetaDataPair");
        return this.nem.default.com.requests.namespace.mosaicDefinitions(endpoint, mosaicNamespaceId).then(function (value) {
            // Look for the mosaic definition(s) we want in the request response (Could use ["eur", "usd"] to return eur and usd mosaicDefinitionMetaDataPairs)
            var neededDefinition = _this.nem.default.utils.helpers.searchMosaicDefinitionArray(value, [mosaicId]);
            // Get full name of mosaic to use as object key
            var fullMosaicName = mosaicNamespaceId + ':' + mosaicId;
            // Check if the mosaic was found
            if (undefined === neededDefinition[fullMosaicName])
                return console.error("Mosaic not found !");
            // Set mosaic definition into mosaicDefinitionMetaDataPair
            if (!original) {
                //Fix, transform divisibility if 0
                mosaicDefinitionMetaDataPair = neededDefinition[fullMosaicName];
            }
            else {
                mosaicDefinitionMetaDataPair[fullMosaicName] = {};
                mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];
            }
            return mosaicDefinitionMetaDataPair;
        });
    };
    NemProvider.prototype._addDivisibilityToBalance = function (balance) {
        var promises = [];
        for (var _i = 0, _a = balance.data; _i < _a.length; _i++) {
            var mosaic = _a[_i];
            if (mosaic.mosaicId.namespaceId != 'nem') {
                promises.push(this.getMosaicsMetaDataPair(mosaic.mosaicId.namespaceId, mosaic.mosaicId.name, false));
            }
        }
        return Promise.all(promises).then(function (values) {
            var i = 0;
            for (var _i = 0, _a = balance.data; _i < _a.length; _i++) {
                var mosaic = _a[_i];
                if (mosaic.mosaicId.namespaceId != 'nem') {
                    mosaic.definition = values[i];
                    ++i;
                }
            }
            return balance;
        });
    };
    NemProvider.prototype.getBalance = function (address) {
        var _this = this;
        var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
        // Gets account data
        return this.nem.default.com.requests.account.mosaics(endpoint, address).then(function (value) {
            return _this._addDivisibilityToBalance(value);
        }).catch(function (error) {
            return false;
        });
    };
    /* Transfer */
    NemProvider.prototype.isFromNetwork = function (address, isFromNetwork) {
        return this.nem.default.model.address.isFromNetwork(address, this.nem.default.model.network.data.testnet.id);
    };
    NemProvider.prototype.prepareTransaction = function (common, formData) {
        // Create transfer transaction
        var transferTransaction = this.nem.default.model.objects.create("transferTransaction")(formData.recipient, formData.amount, formData.message);
        return this.nem.default.model.transactions.prepare("transferTransaction")(common, transferTransaction, this.nem.default.model.network.data.testnet.id);
    };
    NemProvider.prototype.prepareMosaicTransaction = function (common, formData) {
        var _this = this;
        // Create transfer transaction
        var transferTransaction = this.nem.default.model.objects.create("transferTransaction")(formData.recipient, formData.amount, formData.message);
        var mosaicAttachment = this.nem.default.model.objects.create("mosaicAttachment")(formData.mosaics[0].mosaicId.namespaceId, formData.mosaics[0].mosaicId.name, formData.mosaics[0].quantity);
        transferTransaction.mosaics.push(mosaicAttachment);
        return this.getMosaicsMetaDataPair(formData.mosaics[0].mosaicId.namespaceId, formData.mosaics[0].mosaicId.name, true).then(function (value) {
            return _this.nem.default.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, value, _this.nem.default.model.network.data.testnet.id);
        });
    };
    NemProvider.prototype.confirmTransaction = function (common, transactionEntity) {
        var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
        return this.nem.default.model.transactions.send(common, transactionEntity, endpoint);
    };
    NemProvider.prototype._addDivisibilityToTransaction = function (mosaics) {
        var promises = [];
        for (var _i = 0, mosaics_1 = mosaics; _i < mosaics_1.length; _i++) {
            var mosaic = mosaics_1[_i];
            if (mosaic.mosaicId.namespaceId != 'nem') {
                promises.push(this.getMosaicsMetaDataPair(mosaic.mosaicId.namespaceId, mosaic.mosaicId.name, false));
            }
        }
        return Promise.all(promises).then(function (values) {
            var i = 0;
            for (var _i = 0, mosaics_2 = mosaics; _i < mosaics_2.length; _i++) {
                var mosaic = mosaics_2[_i];
                if (mosaic.mosaicId.namespaceId != 'nem') {
                    mosaic.definition = values[i];
                    ++i;
                }
                else {
                    mosaic.definition = {
                        properties: [
                            { value: 6 }
                        ]
                    };
                }
            }
            return mosaics;
        });
    };
    NemProvider.prototype._adaptTransactions = function (transactions) {
        var promises = [];
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var tx = transactions_1[_i];
            if (tx.transaction.mosaics) {
                promises.push(this._addDivisibilityToTransaction(tx.transaction.mosaics));
            }
        }
        return Promise.all(promises).then(function (values) {
            var i = 0;
            for (var _i = 0, transactions_2 = transactions; _i < transactions_2.length; _i++) {
                var tx = transactions_2[_i];
                if (tx.transaction.mosaics) {
                    tx.transaction.mosaics = values[i];
                    ++i;
                }
            }
            return transactions;
        });
    };
    NemProvider.prototype.getAllTransactionsFromAnAccount = function (address) {
        var _this = this;
        var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
        return this.nem.default.com.requests.account.allTransactions(endpoint, address).then(function (value) {
            return _this._adaptTransactions(value);
        });
    };
    NemProvider.prototype.getUnconfirmedTransactionsFromAnAccount = function (address) {
        var _this = this;
        var endpoint = this.nem.default.model.objects.create("endpoint")(this.nem.default.model.nodes.defaultTestnet, this.nem.default.model.nodes.defaultPort);
        return this.nem.default.com.requests.account.unconfirmedTransactions(endpoint, address).then(function (value) {
            return _this._adaptTransactions(value);
        });
    };
    return NemProvider;
}());
NemProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Storage])
], NemProvider);
export { NemProvider };
//# sourceMappingURL=nem.provider.js.map