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
			return { rutError: true };
		}

		let cleanValue: string = clean(control.value);

		let esValido: boolean = validate(cleanValue);

		let formateado: string = format(cleanValue);

		if (esValido) {
			control.setValue(formateado);

			return null;
		} else {
			//control.setErrors(null);
			control.setValue(cleanValue);
			control.markAsTouched();
			return { rutError: true };
		}
	}
}
