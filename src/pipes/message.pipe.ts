import { Pipe, PipeTransform } from '@angular/core';
/*
 * Transforms message Payload to readable message
 * Usage:
 *   message.payload | message
 * Example:
 *   {{ message.payload |  message}}
 *   formats to: Hello World!
*/

@Pipe({name: 'message'})
export class MessagePipe implements PipeTransform {
  transform(value: string): string {
  	var result = '';
  	if (value){
    	for (var i=0; i<value.length; i++) {
      	result += String.fromCharCode(parseInt(value.charCodeAt(i).toString(), 16));
    	}
    }
    return result;
	}
}
