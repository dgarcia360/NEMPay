import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {ToastProvider} from '../../../providers/toast/toast.provider';
import {WalletProvider} from '../../../providers/wallet/wallet.provider';
import {ContactProvider} from '../../../providers/contact/contact.provider';
import {AlertProvider} from '../../../providers/alert/alert.provider';
import {NemProvider} from '../../../providers/nem/nem.provider';

import {Address} from 'nem-library';

import {ContactListPage} from '../list/list';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'update-contact-page',
    templateUrl: 'update.html'
})
export class UpdateContactPage {
    owner: string;
    name: string;
    address: string;
    id : number;

    constructor(public navCtrl: NavController, private navParams: NavParams, private nem: NemProvider, private wallet: WalletProvider, private toast: ToastProvider, private contact: ContactProvider, private loading: LoadingController, public translate: TranslateService, private alert: AlertProvider) {
       this.owner = navParams.get('owner');
       this.name = navParams.get('name');
       this.address = navParams.get('address');
       this.id = navParams.get('id');

    }

    ionViewWillEnter() {

    }
    
    /**
     * check if an address is valid
     * @param address address to check
     */
    isValidAddress(address:string){
       var valid;

       try{
            if (this.nem.isFromNetwork(new Address(address))) valid = true;
            else valid = false;
       }
       catch(e){
         valid = false;
       }
       return valid;
    }

    /**
     * updates contact or creates it
     */
    updateContact(){
        let _rawAddress = this.address.toUpperCase().replace(/-/g, '');

        if (!this.isValidAddress(_rawAddress)){
          this.alert.showAlertDoesNotBelongToNetwork();
        }
        else{
          if (this.id){
              this.contact.update(this.id, this.name, this.address).then(_=>{
                  this.toast.contactUpdated();
                  this.navCtrl.push(ContactListPage, {});
              }).catch(err => {
                console.log(err)
              });
          }
          else{
              this.contact.create(this.owner, this.name, _rawAddress).then(_=>{
                  this.toast.contactCreated();
                  this.navCtrl.push(ContactListPage, {});
              }).catch(err => {
                console.log(err)
              });
          }
        }
    }

}
