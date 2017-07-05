import {Injectable} from '@angular/core';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import * as nemSdk from "nem-sdk";

/*
 Generated class for the ConfigProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class ConfigProvider {
    nem: any;
    network: number;

    constructor() {
        this.nem = nemSdk;
        this.network = -104;
    }


    public defaultNetwork() {
        return this.network;
    }



}
