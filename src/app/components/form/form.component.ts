import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MatStep } from '@angular/material/stepper';
import { RutService } from '../../services/rut.service';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
	/* private geoCoder;
	@ViewChild('search')
	public searchElementRef: ElementRef; */
	isLinear: boolean = false;
	/**
	 * Definición de formularios por grupos segùn las secciones
	 */
	forma: FormGroup;
	datosPersonales: FormGroup;
	datosModoVida: FormGroup;
	datosContenido: FormGroup;
	/**
	 * Data MOCKUP para los selects, se pueden guardar como un json o como un TS
	 * Si es necesario sacarlos de la base de datos para proximas versiones
	 */
	dataContenido: Array<any> = [
		{ name: 'Deportes', value: 'deportes' },
		{ name: 'Series y Peliculas', value: 'series_peliculas' },
		{ name: 'Documentales', value: 'documentales' },
		{ name: 'Matinales', value: 'matinales' },
		{ name: 'Programas TV Chile', value: 'programas_nacional' },
		{ name: 'Videojuegos', value: 'videojuegos' },
		{ name: 'Videos cortos en internet', value: 'videos_cortos' },
		{ name: 'Redes sociales', value: 'rrss' },
	];

	dataPreferencias: Array<any> = [
		{ name: 'Deportes', value: 'deportes' },
		{ name: 'Belleza', value: 'belleza' },
		{ name: 'Arte', value: 'arte' },
		{ name: 'Gastronomia', value: 'gastronomia' },
		{ name: 'Música TV Chile', value: 'musica_nacional' },
		{ name: 'Decoración', value: 'decoracion' },
		{ name: 'Videojuegos', value: 'videojugos' },
		{ name: 'Tecnología', value: 'tecnologia' },
		{ name: 'Automovilismo', value: 'automovilismo' },
	];

	dataPlataformas: Array<any> = [
		{ name: 'Netflix', value: 'netflix' },
		{ name: 'Amazon Prime', value: 'amazon_prime' },
		{ name: 'Youtube Prime', value: 'youtube_prime' },
		{ name: 'HBO', value: 'hbo' },
		{ name: 'Movistar Play', value: 'movistar' },
		{ name: 'Apple TV', value: 'apple_tv' },
		{ name: 'Hulu', value: 'hulu' },
		{ name: 'Disney +', value: 'disney_plus' },
		{ name: 'Vtr Play', value: 'vtr_play' },
		{ name: 'Otro', value: 'otro' },
	];

	dataRedes: Array<any> = [
		{ name: 'Instagram', value: 'instagram' },
		{ name: 'Facebook', value: 'facebook' },
		{ name: 'Youtube', value: 'youtube' },
		{ name: 'TikTok', value: 'tiktok' },
		{ name: 'Twitter', value: 'twitter' },
		{ name: 'Snapchat', value: 'snapchat' },
		{ name: 'Pinterest', value: 'pinterest' },
		{ name: 'Reddit', value: 'reddit' },
		{ name: 'Ninguno', value: 'ninguno' },
		{ name: 'Otro', value: 'otro' },
	];
	/**Fin de la data Mockup */

	/**Constructor de la clase para acceder a los distintos servicios que cargara el formulario */
	constructor(
		private fb: FormBuilder,
		/* private mapsApiLoader: MapsAPILoader */
		/* private ngZone: NgZone, */
		private rutService: RutService
	) {
		this.crearFromulario();
	}

	ngOnInit(): void {}
	//GETTERS para el formulario
	/* get pasatiempos() {
		return this.form.get('nombre') as FormArray;
	} */
	get nombreNoValido() {
		return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
	}
	get apellidoNoValido() {
		return this.forma.get('apellido').invalid && this.forma.get('nombre').touched;
	}
	get emailNoValido() {
		return this.forma.get('email').invalid && this.forma.get('nombre').touched;
	}
	get rutNoValido() {
		return this.forma.get('rut').invalid && this.forma.get('nombre').touched;
	}
	get direccionNoValido() {
		return this.forma.get('direccion').invalid && this.forma.get('nombre').touched;
	}
	get oficinaNoValido() {
		return this.forma.get('oficina').invalid && this.forma.get('nombre').touched;
	}
	get ciudadNoValido() {
		return this.forma.get('ciudad').invalid;
	}
	get generoNoValido() {
		return this.datosPersonales.get('genero').invalid && this.datosPersonales.get('nombre').touched;
	}
	get fechaNacimientoNoValido() {
		return this.datosPersonales.get('fechaNacimiento').invalid && this.datosPersonales.get('nombre').touched;
	}

	/**
	 * Metodo para invocar al Form builder y crear cada uno de los
	 * campos reactivos del formulario
	 */
	private async crearFromulario() {
		console.log('CREANDO FORMULARIO');
		/**
		 * Creación de validators para cada uno de los campos del
		 * o de los formularios
		 */
		let nombreVals: Validators[] = [Validators.required, Validators.minLength(5)];
		let apellidoVals: Validators[] = [Validators.required, Validators.minLength(5)];
		//Template Pattern del email
		let emailVals: Validators[] = [
			Validators.required,
			Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
		];
		/**
		 * TODO:
		 * Validar el RUT a través de la librerìa RUT.js
		 */
		let rutVals: Validators[] = [Validators.required, Validators.minLength(5), this.rutService.rutValidate];
		/**
		 * TODO:
		 * Agregar el autocomplete de google APIS
		 */
		let direccionVals: Validators[] = [Validators.required, Validators.minLength(5)];
		let oficinaVals: Validators[] = [Validators.required, Validators.minLength(5)];
		let ciudadVals: Validators[] = [Validators.required, Validators.minLength(5)];

		let generoVals: Validators[] = [Validators.required];
		let fechaNacimientoVals: Validators[] = [Validators.required];
		let estadoCivilVals: Validators[] = [Validators.required];
		let profesionVals: Validators[] = [Validators.required];
		let educacionVals: Validators[] = [Validators.required];
		let viveConVals: Validators[] = [Validators.required];
		let residenciaVals: Validators[] = [Validators.required];
		let deportesVals: Validators[] = [Validators.required];
		let tieneHijoVals: Validators[] = [Validators.required];
		let tieneMascotaVal: Validators[] = [Validators.required];
		/**Creacion del grupo de campos para el formulario de Datos Básicos */
		this.forma = this.fb.group({
			nombre: ['', nombreVals],
			apellido: ['', apellidoVals],
			email: ['', emailVals],
			rut: ['', rutVals],
			direccion: ['', direccionVals],
			oficina: ['', oficinaVals],
			ciudad: ['', ciudadVals],

			genero: ['', generoVals],
			fechaNacimiento: ['', fechaNacimientoVals],
			estadoCivil: ['', estadoCivilVals],
			profesion: ['', profesionVals],
			educacion: ['', educacionVals],

			viveCon: ['', viveConVals],
			residencia: ['', residenciaVals],
			deportes: ['', deportesVals],
			deporteFrecuencia: ['', [Validators.required]],
			tieneHijo: ['', tieneHijoVals],
			cuantosHijos: ['', [Validators.required]],
			mascota: ['', tieneMascotaVal],
			contenido: this.fb.array([], [Validators.required]),
			preferencias: this.fb.array([], [Validators.required]),

			tieneInternet: ['', [Validators.required]],
			proveedorServicio: ['', [Validators.required]],
			plataformas: this.fb.array([], [Validators.required]),
			redes: this.fb.array([], [Validators.required]),
		});
	}

	public async enviarFormulario() {
		console.log(this.forma.value);

		return Object.values(this.forma.controls).forEach((control) => {
			if (control instanceof FormGroup) {
				Object.values(control.controls).forEach((control) => control.markAsTouched());
			} else {
				control.markAsTouched();
			}
		});
	}

	public onGustosChange(e) {
		const checkArray: FormArray = this.forma.get('contenido') as FormArray;

		if (e.target.checked) {
			checkArray.push(new FormControl(e.target.value));
		} else {
			let i: number = 0;
			checkArray.controls.forEach((item: FormControl) => {
				if (item.value == e.target.value) {
					checkArray.removeAt(i);
					return;
				}
				i++;
			});
		}
	}
	public onPreferenciasChange(e) {
		const checkArray: FormArray = this.forma.get('preferencias') as FormArray;

		if (e.target.checked) {
			checkArray.push(new FormControl(e.target.value));
		} else {
			let i: number = 0;
			checkArray.controls.forEach((item: FormControl) => {
				if (item.value == e.target.value) {
					checkArray.removeAt(i);
					return;
				}
				i++;
			});
		}
	}
	public onPlataformaChange(e) {
		const checkArray: FormArray = this.forma.get('plataformas') as FormArray;

		if (e.target.checked) {
			checkArray.push(new FormControl(e.target.value));
		} else {
			let i: number = 0;
			checkArray.controls.forEach((item: FormControl) => {
				if (item.value == e.target.value) {
					checkArray.removeAt(i);
					return;
				}
				i++;
			});
		}
	}
	public onRedesChange(e) {
		const checkArray: FormArray = this.forma.get('redes') as FormArray;

		if (e.target.checked) {
			checkArray.push(new FormControl(e.target.value));
		} else {
			let i: number = 0;
			checkArray.controls.forEach((item: FormControl) => {
				if (item.value == e.target.value) {
					checkArray.removeAt(i);
					return;
				}
				i++;
			});
		}
	}

	/* loadAutocomplete() {
		this.mapsApiLoader.load().then(() => {
			this.geoCoder = new google.maps.Geocoder();

			const autocomplete = new google.maps.places.AutoComplete(this.searchElementRef.nativeElement);
			autocomplete.addListener('places_changed', () => {
				this.ngZone.run(() => {
					const place: google.maps.places.PlaceResult = autocomplete.getPlace();
					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					console.log(place);
				});
			});
		});
	} */
}
