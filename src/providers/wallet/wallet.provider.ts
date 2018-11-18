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
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {LocalDateTime} from "js-joda";
import {Base64} from "js-base64";
import {NetworkTypes, Password, SimpleWallet} from "nem-library";


@Injectable()
export class WalletProvider {
    wallets: SimpleWallet[];
    selectedWallet: SimpleWallet;

    constructor(private storage: Storage) {
        this.selectedWallet = null;
    }

    /**
     * Store wallet in localStorage
     * @param wallet
     * @return Promise<SimpleWallet>
     */
    public storeWallet(wallet: SimpleWallet): Promise<SimpleWallet> {
        let result = [];
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

    /**
     * Check if wallet name exists
     * @param walletName
     * @return Promise<boolean>
     */
    public checkIfWalletNameExists(walletName): Promise<boolean> {
        let exists = false;

        return this.getWallets().then(
            value => {
                let wallets = value || [];
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
     * Returns the selected wallet
     * @return  SimpleWallet
     */
    public getSelectedWallet(): SimpleWallet {
        return this.selectedWallet;
    }

    /**
     * Gets wallets stored in localStorage
     * @return Promise<SimpleWallet[]>
     */
    public getWallets(): Promise<SimpleWallet[]> {
        return this.storage.get('wallets').then(data => {
            let result = [];
            if (data) {
                result = JSON.parse(data).map(walletFile => {
                    if (walletFile.name) {
                        return this.convertJSONWalletToFileWallet(walletFile);
                    } else {
                        return SimpleWallet.readFromWLT(walletFile);
                    }
                });
            }
            return result;
        });
    }

    /**
     * Set a selected wallet
     */
    public setSelectedWallet(wallet: SimpleWallet) {
        this.selectedWallet = wallet;
    }

    /**
     * Remove selected Wallet
     */
    public unsetSelectedWallet() {
        this.selectedWallet = null;
    }

    /**
     * Converts JSON wallet to file wallet
     * @param wallet json wallet
     * @return SimpleWallet
     */
    private convertJSONWalletToFileWallet(wallet): SimpleWallet {
        const walletString = Base64.encode(JSON.stringify({
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
     * Decrypt private key
     * @param password
     * @param wallet
     * @return boolean
     */
    public passwordMatchesWallet(password: string, wallet: SimpleWallet): boolean {
        try {
            wallet.unlockPrivateKey(new Password(password))
            return true;
        } catch (err) {
            return false;
        }
    }
}