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
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {SocialSharing} from '@ionic-native/social-sharing';
import {ToastProvider} from '../../../providers/toast/toast.provider';
import {WalletProvider} from '../../../providers/wallet/wallet.provider';
import {ContactProvider} from '../../../providers/contact/contact.provider';
import {AlertProvider} from '../../../providers/alert/alert.provider';
import {NemUtils} from '../../../providers/nem/nem.utils';
import {ContactListPage} from '../list/list';
import {BalancePage} from '../../balance/balance';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NemValidator} from "../../../validators/nem.validator";
import {Address} from "nem-library";

@Component({
    selector: 'update-contact-page',
    templateUrl: 'update.html'
})
export class UpdateContactPage {
    private owner: string;
    private previousAddress: string;
    private id : number;
    private contactForm : FormGroup;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nemUtils: NemUtils,
                private wallet: WalletProvider, private toast: ToastProvider, private contact: ContactProvider,
                private loading: LoadingController, public translate: TranslateService, private alert: AlertProvider,
                private socialSharing:SocialSharing) {

        this.owner = navParams.get('owner');
        this.id = navParams.get('id');

        this.contactForm = new FormGroup ({
            name: new FormControl(navParams.get('name') || '', Validators.required),
            address: new FormControl(navParams.get('address') || '', NemValidator.isValidAddress),
        });

        if (this.id) {
            this.previousAddress = navParams.get('address');
        }
    }

    /**
     * Updates contact or creates it
     */
    public saveContact(){
        const address = new Address(this.contactForm.value.address).plain();
        const name = this.contactForm.value.name;
        if (this.id) {
            this.updateContact(address, name);
        } else {
            this.createContact(address, name);
        }
    }

    /**
     * Moves to balance page
     */
    public goToBalance() {
        this.navCtrl.push(BalancePage, {'address': this.previousAddress});
    };

    /**
     * Share account's address using installed apps
     */
    public shareAddress() {
        this.socialSharing
            .share(this.previousAddress, this.navParams.get('name') || '' + " Address", null, null)
            .then(ignored => {})
            .catch( err => console.log(err));
    }

    /**
     * Creates a new contact
     * @param address address to assign
     * @param name wallet name
     */
    private createContact(address: string, name: string){
        this.contact.searchContactName(this.owner, address).then(contacts =>{
            if(contacts.length > 0) {
                this.alert.showContactAlreadyExists();
            } else {
                this.contact.create(this.owner, name, address).then(ignored => {
                    this.toast.showContactCreated();
                    this.navCtrl.push(ContactListPage, {});
                });
            }
        }).catch(err => console.log(err));
    }

    /**
     * Updates existing contact
     * @param address address to assign
     * @param name wallet name

     */
    private updateContact(address: string, name: string){

        this.contact.searchContactName(this.owner, address).then(contacts =>{
            if(contacts.length > 0 && address !== this.previousAddress) {
                this.alert.showContactAlreadyExists();
            } else {
                this.contact.update(this.id, name, address).then(ignored=> {
                    this.toast.showContactUpdated();
                    this.navCtrl.push(ContactListPage, {});
                });
            }
        }).catch(err => console.log(err));
    }
}
