var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AccountPage } from '../pages/account/account';
import { TransactionsPage } from '../pages/transactions/transactions';
import { BalancePage } from '../pages/balance/balance';
import { LoginPage } from '../pages/login/login';
import { Network } from '@ionic-native/network';
var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, network, alertCtrl) {
        this.rootPage = LoginPage;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            var alert = alertCtrl.create({
                title: 'Your phone is disconnected from internet',
                subTitle: 'Open the app again once you have internet connection',
            });
            network.onDisconnect().subscribe(function () {
                alert.present();
            });
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp.prototype.goToBalance = function (params) {
        if (!params)
            params = {};
        this.navCtrl.setRoot(BalancePage);
    };
    MyApp.prototype.goToAccount = function (params) {
        if (!params)
            params = {};
        this.navCtrl.setRoot(AccountPage);
    };
    MyApp.prototype.goToTransactions = function (params) {
        if (!params)
            params = {};
        this.navCtrl.setRoot(TransactionsPage);
    };
    return MyApp;
}());
__decorate([
    ViewChild(Nav),
    __metadata("design:type", Nav)
], MyApp.prototype, "navCtrl", void 0);
MyApp = __decorate([
    Component({
        templateUrl: 'app.html'
    }),
    __metadata("design:paramtypes", [Platform, StatusBar, SplashScreen, Network, AlertController])
], MyApp);
export { MyApp };
//# sourceMappingURL=app.component.js.map