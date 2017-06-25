var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Pipe } from '@angular/core';
import { NemProvider } from '../providers/nem/nem.provider';
/*
 * Transforms nemDate into readable date
 * Usage:
 *   date_in-nem_format | nemDate
 * Example:
 *   {{ date_in-nem_format |  nemDate}}
 *   formats to: 12/24/2017
*/
var NemDatePipe = (function () {
    function NemDatePipe(nem) {
        this.nem = nem;
    }
    NemDatePipe.prototype.transform = function (value) {
        return this.nem.nemDate(value);
    };
    return NemDatePipe;
}());
NemDatePipe = __decorate([
    Pipe({ name: 'nemDate' }),
    __metadata("design:paramtypes", [NemProvider])
], NemDatePipe);
export { NemDatePipe };
//# sourceMappingURL=nem-date.pipe.js.map