import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { RutService } from '../../services/rut.service';
import { PlacesService } from '../../services/places.service';
/**
 * @title Stepper overview
 */
@Component({
	selector: 'stepper-example',
	templateUrl: 'stepper-example.component.html',
	styleUrls: ['stepper-example.component.css'],
})
export class StepperExampleComponent implements OnInit {
	//Instancia Geocoder para la búsqueda de places y autocomplete
	placeResult: google.maps.places.PlaceResult;
	/////////////////////////////////
	tieneHijos: boolean = false;
	practicaDeporte: boolean = false;
	tieneHijo: boolean = false;
	tieneMascota: boolean = false;
	isp: boolean = false;
	///////////////////////////////
	contenidoMax: boolean;
	prefMax: boolean;
	redesMax: boolean;

	//Limites para la fecha de nacimiento
	minDate = new Date(1960, 0, 1);
	maxDate = new Date();
	//Definicion del formulario
	datosBasicos: FormGroup;
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
	constructor(private fb: FormBuilder, private rutService: RutService, private _ps: PlacesService) {
		this.crearFromulario();
		this.eventListeners();
	}

	ngOnInit(): void {}
	//GETTERS para el formulario
	/* get pasatiempos() {
		return this.form.get('nombre') as FormArray;
	} */
	get nombreNoValido() {
		return this.datosBasicos.get('nombre').invalid && this.datosBasicos.get('nombre').touched;
	}
	get apellidoNoValido() {
		return this.datosBasicos.get('apellido').invalid && this.datosBasicos.get('apellido').touched;
	}
	get emailNoValido() {
		return this.datosBasicos.get('email').invalid && this.datosBasicos.get('email').touched;
	}
	get rutNoValido() {
		return this.datosBasicos.get('rut').invalid && this.datosBasicos.get('rut').touched;
	}
	get direccionNoValido() {
		return this.datosBasicos.get('direccion').invalid;
	}
	get dirNumNoValido() {
		return this.datosBasicos.get('dirNum').invalid && this.datosBasicos.get('dirNum').touched;
	}
	get oficinaNoValido() {
		return this.datosBasicos.get('oficina').invalid && this.datosBasicos.get('oficina').touched;
	}
	get ciudadNoValido() {
		return this.datosBasicos.get('ciudad').invalid;
	}
	get generoNoValido() {
		return this.datosBasicos.get('genero').invalid && this.datosBasicos.get('genero').touched;
	}
	get fechaNacimientoNoValido() {
		return this.datosBasicos.get('fechaNacimiento').invalid && this.datosBasicos.get('fechaNacimiento').touched;
	}
	/***
	 * Getters para la SECCION No.1 del formulario
	 */
	get seccionUnoNoValido() {
		return (
			this.datosBasicos.get('nombre').valid &&
			this.datosBasicos.get('apellido').valid &&
			this.datosBasicos.get('email').valid &&
			this.datosBasicos.get('rut').valid &&
			this.datosBasicos.get('direccion').valid &&
			this.datosBasicos.get('oficina').valid &&
			this.datosBasicos.get('ciudad').valid
		);
	}

	get seccionDosNoValido() {
		return (
			this.datosBasicos.get('genero').valid &&
			this.datosBasicos.get('fechaNacimiento').valid &&
			this.datosBasicos.get('estadoCivil').valid &&
			this.datosBasicos.get('profesion').valid &&
			this.datosBasicos.get('educacion').valid
		);
	}

	get seccionTresNoValido() {
		return (
			this.datosBasicos.get('viveCon').valid &&
			this.datosBasicos.get('residencia').valid &&
			this.datosBasicos.get('deportes').valid &&
			this.datosBasicos.get('deporteFrecuencia').valid &&
			this.datosBasicos.get('tieneHijo').valid &&
			this.datosBasicos.get('cuantosHijos').valid &&
			this.datosBasicos.get('mascota').valid
		);
	}

	get seccionCuatroNoValido() {
		return (
			this.datosBasicos.get('tieneInternet').valid &&
			this.datosBasicos.get('proveedorServicio').valid &&
			this.datosBasicos.get('contenido').valid &&
			this.datosBasicos.get('preferencias').valid &&
			this.datosBasicos.get('plataformas').valid &&
			this.datosBasicos.get('redes').valid
		);
	}

	/**
	 * Metodo para crear los listener del campo de mapas
	 */
	private eventListeners() {
		this.datosBasicos.get('contenido').valueChanges.subscribe((value: any[]) => {
			console.log(value);
			if (value.length >= 3) {
				this.contenidoMax = true;
			}
		});

		this.datosBasicos.get('preferencias').valueChanges.subscribe((value: any[]) => {
			console.log(value);
			if (value.length >= 3) {
				this.prefMax = true;
			}
		});

		this.datosBasicos.get('redes').valueChanges.subscribe((value: any[]) => {
			console.log(value);
			if (value.length >= 3) {
				this.redesMax = true;
			}
		});

		this.datosBasicos.get('deportes').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.practicaDeporte = true;
			} else if (value === 'false') {
				this.practicaDeporte = false;
				this.datosBasicos.get('deporteFrecuencia').reset();
			}
		});

		this.datosBasicos.get('tieneHijo').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.tieneHijo = true;
			} else if (value === 'false') {
				this.tieneHijo = false;
				this.datosBasicos.get('cuantosHijos').reset();
			}
		});

		this.datosBasicos.get('mascota').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.tieneMascota = true;
			} else if (value === 'false') {
				this.tieneMascota = false;
				this.datosBasicos.get('tieneMascota').reset();
			}
		});

		this.datosBasicos.get('tieneInternet').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.isp = true;
			} else if (value === 'false') {
				this.isp = false;
			}
		});
	}
	/**
	 * Metodo para invocar al Form builder y crear cada uno de los
	 * campos reactivos del formulario
	 */
	private async crearFromulario() {
		/**
		 * Creación de validators para cada uno de los campos del
		 * o de los formularios
		 */
		let nombreVals: Validators[] = [
			Validators.required,
			Validators.minLength(5),
			Validators.pattern('[a-zA-Z]+$/;'),
		];
		let apellidoVals: Validators[] = [
			Validators.required,
			Validators.minLength(5),
			Validators.pattern('[a-zA-Z]+$/;'),
		];
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
		let estadoVals: Validators[] = [Validators.required, Validators.minLength(3)];
		let dirNumVals: Validators[] = [Validators.required, Validators.minLength(1)];
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
		let mascotaVal: Validators[] = [Validators.required];
		/**Creacion del grupo de campos para el formulario de Datos Básicos */
		this.datosBasicos = this.fb.group({
			nombre: ['', nombreVals],
			apellido: ['', apellidoVals],
			email: ['', emailVals],
			rut: ['', rutVals],
			direccion: ['', direccionVals],
			dirNum: ['', dirNumVals],
			estado: ['', estadoVals],
			oficina: ['', oficinaVals],
			ciudad: ['', ciudadVals],
			latLon: this.fb.array([], []),

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
			mascota: ['', mascotaVal],
			tieneMascota: ['', tieneMascotaVal],
			tieneInternet: ['', [Validators.required]],
			proveedorServicio: ['', [Validators.required]],
			contenido: this.fb.array([], [Validators.required]),
			preferencias: this.fb.array([], [Validators.required]),
			plataformas: this.fb.array([], [Validators.required]),
			redes: this.fb.array([], [Validators.required]),
		});
	}

	/**
	 * Metodo para enviar la información al rest service
	 *
	 */
	public async enviarFormulario() {
		console.log(this.datosBasicos.value);

		return Object.values(this.datosBasicos.controls).forEach((control) => {
			if (control instanceof FormGroup) {
				Object.values(control.controls).forEach((control) => control.markAsTouched());
			} else {
				control.markAsTouched();
			}
		});
	}

	public onGustosChange(e) {
		const checkArray: FormArray = this.datosBasicos.get('contenido') as FormArray;

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
		const checkArray: FormArray = this.datosBasicos.get('preferencias') as FormArray;

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
		const checkArray: FormArray = this.datosBasicos.get('plataformas') as FormArray;

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
		const checkArray: FormArray = this.datosBasicos.get('redes') as FormArray;

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
	/**
	 * Obtener la direccion resultado desde los servicios de google
	 * @param place
	 */
	getAddress(place: google.maps.places.PlaceResult) {
		/**
		 * Colocar los valores por defecto en el formulario
		 */
		this.placeResult = place;
		this.datosBasicos.get('direccion').setValue(this._ps.getAddress(place));
		this.datosBasicos.get('ciudad').setValue(this._ps.getCity(place));
		this.datosBasicos.get('estado').setValue(this._ps.getState(place));
		this.datosBasicos.get('dirNum').setValue(this._ps.getStreetNumber(place));
	}
}
