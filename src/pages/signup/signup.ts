import {Component} from '@angular/core';
import {NavController, MenuController} from 'ionic-angular';
import {SignupSimpleWalletPage} from '../signup_simplewallet/signup';
import {SignupPrivateKeyPage} from '../signup_privatekey/signup';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})

export class SignupPage {

    tab1Root = SignupSimpleWalletPage;
    tab2Root = SignupPrivateKeyPage;

    constructor(public navCtrl: NavController, private menu: MenuController) {

    }

    ionViewWillEnter() {
        // the left menu should be disabled on the login page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the left menu when leaving the login page
        this.menu.enable(true);
    }

}
