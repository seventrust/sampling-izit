import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { validate, clean, format } from 'rut.js';

interface ErrorValidate {
	[s: string]: boolean;
}
@Injectable({
	providedIn: 'root',
})
export class RutService {
	constructor() {}

	public rutValido(control: FormControl): ErrorValidate {
		if (!control.value) {
			return null;
		}

		let cleanValue: string = clean(control.value);

		let esValido: boolean = validate(cleanValue);

		if (esValido) {
			let formateado: string = format(cleanValue);
			control.setValue(formateado);
			return {
				rutValido: true,
			};
		} else {
			return null;
		}
	}
}
