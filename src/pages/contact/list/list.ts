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
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {AlertProvider} from '../../../providers/alert/alert.provider';
import {ToastProvider} from '../../../providers/toast/toast.provider';
import {WalletProvider} from '../../../providers/wallet/wallet.provider';
import {ContactProvider} from '../../../providers/contact/contact.provider';
import {LoginPage} from '../../login/login';
import {UpdateContactPage} from '../update/update';
import {Address, SimpleWallet} from 'nem-library';

@Component({
    selector: 'page-contact-list',
    templateUrl: 'list.html'
})
export class ContactListPage {
    private selectedWallet: SimpleWallet;
    private contacts: Object[];

    constructor(public navCtrl: NavController, private wallet: WalletProvider, private alert: AlertProvider,
                private toast: ToastProvider, private contact: ContactProvider, public translate: TranslateService) {

    }

    ionViewWillEnter() {
        this.selectedWallet = this.wallet.getSelectedWallet();
        if (!this.selectedWallet) {
            this.navCtrl.setRoot(LoginPage);
        } else {
            this.getContactsByOwner(this.selectedWallet.address);
        }
    }

    /**
     * Deletes contact from storage by id
     * @param id database contact's identifier
     */
    public deleteContact(id: number) {
        this.contact.delete(id).then(ignored =>{
            this.getContactsByOwner(this.selectedWallet.address);
        });
    };

    /**
     * Moves to update contact page
     * @param id database contact's identifier
     * @param name contact's name to edit
     * @param address contact's address to edit
     */
    public goToUpdateContact(id?: number, name?: string, address?: string) {
        const owner = this.selectedWallet.address.plain();
        if(id) {
            this.navCtrl.push(UpdateContactPage, {'id': id, 'owner': owner,'name': name, 'address': address});
        } else {
            this.navCtrl.push(UpdateContactPage, {'id': null, 'owner': owner, 'name': null, 'address': null});
        }
    };

    /**
     * Loads this.contacts with owner's stored contacts
     * @param owner address
     */
    private getContactsByOwner(owner: Address) {
        this.contact
            .getAllByOwner(owner.plain())
            .then(contacts => {
                this.contacts = contacts;
            }).catch(err => console.log(err));
    };

}
