var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
var DivideByExponentialBaseTenPipe = (function () {
    function DivideByExponentialBaseTenPipe() {
    }
    DivideByExponentialBaseTenPipe.prototype.transform = function (value, exponent) {
        var exp = parseFloat(exponent);
        return value / Math.pow(10, isNaN(exp) ? 1 : exp);
    };
    return DivideByExponentialBaseTenPipe;
}());
DivideByExponentialBaseTenPipe = __decorate([
    Pipe({ name: 'exponentialStrength' })
], DivideByExponentialBaseTenPipe);
export { DivideByExponentialBaseTenPipe };
//# sourceMappingURL=divide-by-exponential-base-ten.pipe.js.map