import {Injectable} from '@angular/core';
import {LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the Alert provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class LoaderProvider {
    loader: any;
    constructor(private loading: LoadingController, private translate: TranslateService) { 
        this.translate.get('PLEASE_WAIT', {}).subscribe((res: string) => {
           this.loader =  this.loading.create({
                content: res
            });
        });
    }

    present() {
        return this.loader.present();
    }

    dismiss() {
        return this.loader.dismiss()
    }

}
