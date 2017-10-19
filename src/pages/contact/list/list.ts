import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {AlertProvider} from '../../../providers/alert/alert.provider';
import {ToastProvider} from '../../../providers/toast/toast.provider';
import {WalletProvider} from '../../../providers/wallet/wallet.provider';
import {ContactProvider} from '../../../providers/contact/contact.provider';

import {LoginPage} from '../../login/login';
import {UpdateContactPage} from '../update/update';

import {SimpleWallet} from 'nem-library';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'page-contact-list',
    templateUrl: 'list.html'
})
export class ContactListPage {
    selectedWallet: SimpleWallet;
    contacts: any;
    constructor(public navCtrl: NavController, private wallet: WalletProvider, private alert: AlertProvider, private toast: ToastProvider, private contact: ContactProvider, private loading: LoadingController, public translate: TranslateService) {

    }

    ionViewWillEnter() {
        this.wallet.getSelectedWallet().then(value => {
            if (!value) this.navCtrl.setRoot(LoginPage);
            else {
                this.selectedWallet = value;
                this._getContactsByOwner(value.address.plain());
            }
        })
    }


    /**
     * Updates this.contacts with database owner's contacts
     * @param owner address
     */

    private _getContactsByOwner(owner:string) {
        this.contact.getAllByOwner(owner).then(contacts =>{
            this.contacts = contacts;
        });
    };


    /**
     * Deletes contact from database by id
     * @param owner address
     */

    public deleteContact(id:number) {
        this.contact.delete(id).then(_ =>{
            this._getContactsByOwner(this.selectedWallet.address.plain());
        });
    };


    /**
     * moves to update contact
     * @param id address
     * @param name name to edit
     * @param address address to edit
     */
    public goToUpdateContact(id?:number, name?:string, address?:string) {
        if(id) this.navCtrl.push(UpdateContactPage, {'id': id, 'owner': this.selectedWallet.address.plain(),'name': name, 'address': address});
        else this.navCtrl.push(UpdateContactPage, {'id': null, 'owner': this.selectedWallet.address.plain(), 'name': null, 'address': null});
    };

}
