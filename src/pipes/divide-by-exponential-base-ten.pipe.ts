import {Pipe, PipeTransform} from '@angular/core';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
 */
@Pipe({name: 'exponentialStrength'})
export class DivideByExponentialBaseTenPipe implements PipeTransform {
    transform(value: number, exponent: string): number {
        let exp = parseFloat(exponent);
        return value / Math.pow(10, isNaN(exp) ? 1 : exp);
    }
}
