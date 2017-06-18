import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import * as nemSdk from "nem-sdk";

/*
  Generated class for the NemSdkProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NemProvider {
  nem: any;

  constructor() {
    console.log('Hello NemSdkProvider Provider');
    this.nem = nemSdk;
  }

  public getProvider(){
    return this.nem;
  }

}
