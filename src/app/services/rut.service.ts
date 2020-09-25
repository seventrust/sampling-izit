import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { validate, clean, format } from 'rut.js';

interface ErrorValidate {
	[s: string]: boolean;
}
@Injectable({
	providedIn: 'root',
})
export class RutService {
	constructor() {}

	public rutValidate(control: FormControl): ErrorValidate {
		if (!control.value) {
			return null;
		}

		let cleanValue: string = clean(control.value);
		console.log(cleanValue);

		let esValido: boolean = validate(cleanValue);

		console.log(`Es un rut valido? -> ${esValido}`);
		if (esValido) {
			let formateado: string = format(cleanValue);

			control.setValue(formateado);
			return {
				correcto: true,
			};
		} else {
			return null;
		}
	}
}
