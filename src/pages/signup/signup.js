var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { SignupBrainWalletPage } from '../signup_brainwallet/signup';
import { SignupSimpleWalletPage } from '../signup_simplewallet/signup';
import { SignupPrivateKeyPage } from '../signup_privatekey/signup';
var SignupPage = (function () {
    function SignupPage(navCtrl, menu) {
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.tab1Root = SignupBrainWalletPage;
        this.tab2Root = SignupSimpleWalletPage;
        this.tab3Root = SignupPrivateKeyPage;
    }
    SignupPage.prototype.ionViewWillEnter = function () {
        // the left menu should be disabled on the login page
        this.menu.enable(false);
    };
    SignupPage.prototype.ionViewWillLeave = function () {
        // enable the left menu when leaving the login page
        this.menu.enable(true);
    };
    return SignupPage;
}());
SignupPage = __decorate([
    Component({
        selector: 'page-signup',
        templateUrl: 'signup.html'
    }),
    __metadata("design:paramtypes", [NavController, MenuController])
], SignupPage);
export { SignupPage };
//# sourceMappingURL=signup.js.map