import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {SocialSharing} from '@ionic-native/social-sharing';

import {ToastProvider} from '../../../providers/toast/toast.provider';
import {WalletProvider} from '../../../providers/wallet/wallet.provider';
import {ContactProvider} from '../../../providers/contact/contact.provider';
import {AlertProvider} from '../../../providers/alert/alert.provider';
import {NemProvider} from '../../../providers/nem/nem.provider';

import {Address} from 'nem-library';

import {ContactListPage} from '../list/list';
import {BalancePage} from '../../balance/balance';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'update-contact-page',
    templateUrl: 'update.html'
})
export class UpdateContactPage {
    owner: string;
    name: string;
    address: string;
    previousAddress:string;
    id : number;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nem: NemProvider, private wallet: WalletProvider, private toast: ToastProvider, private contact: ContactProvider, private loading: LoadingController, public translate: TranslateService, private alert: AlertProvider, private socialSharing:SocialSharing) {
        this.owner = navParams.get('owner');
        this.name = navParams.get('name');
        this.address = navParams.get('address') || '';
        this.id = navParams.get('id');

        if (this.id) this.previousAddress = this.address.toUpperCase().replace('-', '');

    }

    /**
     * creates a new contact
     *@param address address to assign
     */
    private _createContact(address:string){
        this.contact.searchContactName(this.owner, address).then(contacts =>{
            if(contacts.length > 0) this.alert.showContactAlreadyExists();
            else{
                this.contact.create(this.owner, this.name, address).then(_=>{
                    this.toast.showContactCreated();
                    this.navCtrl.push(ContactListPage, {});
                });
            }
        }).catch(err => {
            console.log(err)
        });
    }

    /**
     * updates existing contact
     * @param address address to assign
     */
    private _updateContact(address:string){

        this.contact.searchContactName(this.owner, address).then(contacts =>{

            if(contacts.length > 0 && address != this.previousAddress) this.alert.showContactAlreadyExists();
            else{
                this.contact.update(this.id, this.name, address).then(_=>{
                    this.toast.showContactUpdated();
                    this.navCtrl.push(ContactListPage, {});
                })
            }
        }).catch(err => {
            console.log(err)
        });
    }


    /**
     * updates contact or creates it
     */
    public saveContact(){
        let _rawAddress = this.address.toUpperCase().replace('-', '');
        try{
            if (!this.nem.isValidAddress(new Address(_rawAddress))){
                this.alert.showAlertDoesNotBelongToNetwork();
            }
            else{
                if (this.id) this._updateContact(_rawAddress);
                else this._createContact(_rawAddress);
            }
        }
        catch (err) {
            this.alert.showAlertDoesNotBelongToNetwork();
        }
    }

    /**
     * moves to balance
     * @param address address to send asset
     */
    public goToBalance() {
        this.navCtrl.push(BalancePage, {'address': this.previousAddress});
    };

    /**
     * Share current account through apps installed on the phone
     */
    public shareAddress() {
        this.socialSharing.share(this.previousAddress, this.name + " Address", null, null).then(_ => {

        });
    }

}
