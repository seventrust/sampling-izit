import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { PlacesService, ComunicationService } from '../../services/';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { Router } from '@angular/router';
import { validate, clean, format } from 'rut.js';
import Swal from 'sweetalert2';
import { message } from 'src/app/responses/message-status';
declare var jQuery: any;

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
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
	contarCantidadHijos: boolean;
	cantidadHijos: any[];
	cantidadMascotas: any[];
	//Limites para la fecha de nacimiento
	minDate = new Date(1920, 0, 1); //Fecha de nacimiento hasta 100 años
	maxDate = new Date(new Date().getFullYear() - 14, new Date().getMonth(), new Date().getDay() + 11); //Fecha de nacimiento mayores a 14 años
	//Definicion del formulario
	datosBasicos: FormGroup;
	//Datos complementarios desde el servicio
	formData: ServiceResponse;
	//Datos para evitar en el RUT
	noValidos: any[] = [
		'19',
		'1111111',
		'2222222',
		'3333333',
		'4444444',
		'5555555',
		'6666666',
		'7777777',
		'8888888',
		'9999999',
		'1234567',
		'7654321',
		'11111111',
		'22222222',
		'33333333',
		'44444444',
		'55555555',
		'66666666',
		'77777777',
		'88888888',
		'99999999',
		'12345678',
		'87654321',
	];

	/**Constructor de la clase para acceder a los distintos servicios que cargara el formulario */
	constructor(
		private fb: FormBuilder,
		private _ps: PlacesService,
		private _cs: ComunicationService,
		private router: Router
	) {
		//this.formData = this.router.getCurrentNavigation().extras.state;
		this.getLocalStorageData();
	}
	ngOnInit(): void {
		this.crearFromulario();
		this.eventListeners();
		//STEPPER FUNCTION para la vista
		(function ($) {
			$(document).ready(function () {
				var current_fs, next_fs, previous_fs; //fieldsets
				var opacity;
				var current = 1;
				var steps = parseInt($('fieldset').length);

				setProgressBar(current);

				$('.next').click(function () {
					current_fs = $(this).parent();
					next_fs = $(this).parent().next();

					//Add Class Active
					$('#progressbar li').eq($('fieldset').index(next_fs)).addClass('active');

					//show the next fieldset
					next_fs.show();
					//hide the current fieldset with style
					current_fs.animate(
						{ opacity: 0 },
						{
							step: function (now) {
								// for making fielset appear animation
								opacity = 1 - now;

								current_fs.css({
									display: 'none',
									position: 'relative',
								});
								next_fs.css({ opacity: opacity });
							},
							duration: 500,
						}
					);
					setProgressBar(++current);
					$('html, body').animate({ scrollTop: 0 }, 'slow');
				});

				$('.previous').click(function () {
					current_fs = $(this).parent();
					previous_fs = $(this).parent().prev();

					//Remove class active
					$('#progressbar li').eq($('fieldset').index(current_fs)).removeClass('active');

					//show the previous fieldset
					previous_fs.show();

					//hide the current fieldset with style
					current_fs.animate(
						{ opacity: 0 },
						{
							step: function (now) {
								// for making fielset appear animation
								opacity = 1 - now;

								current_fs.css({
									display: 'none',
									position: 'relative',
								});
								previous_fs.css({ opacity: opacity });
							},
							duration: 500,
						}
					);
					setProgressBar(--current);
				});

				function setProgressBar(curStep) {
					var percent = (100 / steps) * curStep;

					$('.progress-bar').css('width', percent.toFixed() + '%');
				}
			});
		})(jQuery);
	}

	//Obtener los datos para los campos SELECT, RADIO, CHECKBOX
	getLocalStorageData() {
		if (localStorage.getItem('response')) {
			this.formData = JSON.parse(localStorage.getItem('response'));
		} else {
			this.router.navigateByUrl('/result-fail', {
				state: {
					header: 'Oops!',
					subheader: 'Lo sentimos, ha ocurrido  un error',
					message: message.error.message,
				},
			});
		}
	}
	/**
	 * Definicion de Getter's parar la validacion de formularios
	 * los metodos GET devuelven un booleano segùn la evaluacion
	 * y son invocados por angular dentro del html como si fueran un observable
	 */
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
	get contenidoNoValido() {
		return this.datosBasicos.get('contenido').invalid && this.datosBasicos.get('contenido').pristine;
	}
	get preferenciasNoValido() {
		return this.datosBasicos.get('preferencias').invalid && this.datosBasicos.get('preferencias').pristine;
	}
	get redesNoValido() {
		return this.datosBasicos.get('redes').invalid && this.datosBasicos.get('redes').pristine;
	}
	get edadHijos() {
		return this.datosBasicos.get('edadHijos') as FormArray;
	}

	get tiposMascotas() {
		return this.datosBasicos.get('tiposMascota') as FormArray;
	}

	get rut() {
		return this.datosBasicos.get('rut') as FormControl;
	}

	/***
	 * En esta seccio se definen un par de GET's para validar el formulario por
	 * secciones y poder habilitar el siguiente paso en el stepper form.
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
	 * Metodo para la creación de listerner de los campos clave, èstos son utilizados
	 * para suscribirse a los cambios de cualquiera de los campos del formulario
	 * y así disparar validaciones o en su defecto setear valores para otros campos invisibles
	 * dentro del formulario
	 */
	private eventListeners() {
		//Se valida que el usuario haya seleccionado solo 3 checkboxes del apartado
		//REDES
		this.datosBasicos.get('redes').valueChanges.subscribe((value: any[]) => {
			console.log(value);
			if (value[0] == '96') {
				this.redesMax = true;
			}
		});
		//Si el usuario pràctica algún *DEPORTE* entonces se le indica a la vista
		//Que muestre el campo SELECT de frecuencia y si el usuario vuelve a seleccionar
		//NO entonces se resetea el valor
		this.datosBasicos.get('deportes').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.practicaDeporte = true;
			} else if (value === 'false') {
				this.practicaDeporte = false;
				this.datosBasicos.get('deporteFrecuencia').setValue(0);
			}
		});
		//Si el usuario tiene *HIJOS* entonces se le indica a la vista
		//Que muestre el campo SELECT de cantidad de hijops  y si el usuario vuelve a seleccionar
		//NO entonces se resetea el valor
		this.datosBasicos.get('tieneHijo').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.tieneHijo = true;
			} else if (value === 'false') {
				this.tieneHijo = false;
				this.cantidadHijos = [];
			}
		});
		//Si el usuario tiene algún *Mascota* entonces se le indica a la vista
		//Que muestre el campo SELECT de tipo de mascota y si el usuario vuelve a seleccionar
		//NO entonces se resetea el valor
		this.datosBasicos.get('mascota').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.tieneMascota = true;
			} else if (value === 'false') {
				this.tieneMascota = false;
				this.cantidadMascotas = [];
			}
		});
		//Si el usuario tiene algún *ISP* entonces se le indica a la vista
		//Que muestre el campo SELECT de isp's y si el usuario vuelve a seleccionar
		//NO entonces se resetea el valor
		this.datosBasicos.get('tieneInternet').valueChanges.subscribe((value: string) => {
			if (value === 'true') {
				this.isp = true;
			} else if (value === 'false') {
				this.isp = false;
				this.datosBasicos.get('proveedorServicio').setValue(0);
			}
		});
	}

	/**
	 * Metodo para verificar la validez del RUT y formatear su valor
	 * @param e  (event)
	 */
	public verificarRut(e) {
		let esRutValido: boolean = this.noValidos.includes(e.target.value);
		console.log('Es RUT Valido: ' + esRutValido);

		let esMayor: boolean = parseInt(e.target.value) > 1000000;
		let esMenor: boolean = parseInt(e.target.value) < 50000000;
		if (!esRutValido || (!esMenor && !esMayor)) {
			let cleanValue: string = clean(e.target.value);

			let esValido: boolean = validate(cleanValue);

			let formateado: string = format(cleanValue);

			if (!esValido) {
				this.rut.setErrors({ rutNovalido: true });
				this.rut.markAsDirty();
				//this.rut.setValue(cleanValue);
			} else {
				this.rut.setErrors(null);
				this.rut.setValue(formateado);
			}
		} else {
			this.rut.setErrors({ rutNovalido: true });
			this.rut.markAsDirty();
		}
	}
	/**
	 * Metodo para invocar al Form builder y crear cada uno de los
	 * campos reactivos del formulario
	 */
	private async crearFromulario() {
		/**Para crear un formulario reactivo es necesario construir los
		 * datos desde el componente con la ayuda del metodo .group de la
		 * clasee FormBuilder, para ello se instancian los nombres de los campos
		 * con sus respectivos validadores los cuales extienden desde Validators
		 */
		this.datosBasicos = this.fb.group({
			//Datos Básicos  - Seccion 1
			nombre: ['', [Validators.required, Validators.minLength(5)]],
			apellido: ['', [Validators.required, Validators.minLength(5)]],
			email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
			rut: ['', [Validators.required]],
			direccion: [{ disabled: true }, [Validators.required, Validators.minLength(12)]],
			dirNum: [{ disabled: true }, [Validators.required, Validators.minLength(1)]],
			estado: [{ disabled: true }, [Validators.required, Validators.minLength(3)]],
			oficina: ['', ''],
			ciudad: ['', [Validators.required, Validators.minLength(5)]],
			latLon: this.fb.array([], []),
			//Datos Personales - Seccion  2
			genero: ['', [Validators.required]],
			fechaNacimiento: ['', [Validators.required]],
			estadoCivil: ['', [Validators.required]],
			profesion: ['', [Validators.required]],
			educacion: ['', [Validators.required]],
			//Datos estilo de vida  - Seccion 3
			viveCon: ['', [Validators.required]],
			residencia: ['', [Validators.required]],
			deportes: ['', [Validators.required]],
			deporteFrecuencia: ['', [Validators.required]],
			tieneHijo: ['', [Validators.required]],
			cuantosHijos: ['', [Validators.required]],
			edadHijos: this.fb.array([], Validators.required),
			mascota: ['', [Validators.required]],
			cuantasMascotas: ['', [Validators.required]],
			tiposMascota: this.fb.array([], [Validators.required]),
			//Datos consumo multimedia
			tieneInternet: ['', [Validators.required]],
			proveedorServicio: ['', [Validators.required]],
			contenido: this.fb.array([], [Validators.required, Validators.maxLength(3)]),
			preferencias: this.fb.array([], [Validators.required, Validators.maxLength(3)]),
			plataformas: this.fb.array([], [Validators.required]),
			redes: this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
		});

		//Valores por defecto en caso de que el usuario no tenga ningún servicio o mascota etc....
		if (!localStorage.getItem('formulario')) {
			this.datosBasicos.reset({
				cuantasMascotas: 0,
				cuantosHijos: 0,
				deporteFrecuencia: 0,
			});
			this.edadHijos.push(new FormControl('none'));
			this.tiposMascotas.push(new FormControl('none'));
		} else {
			this.datosBasicos.reset(JSON.parse(localStorage.getItem('formulario')));
			this.edadHijos.push(new FormControl('none'));
			this.tiposMascotas.push(new FormControl('none'));
		}
	}

	/**
	 * Metodo para para la validación del formulario y su posterior envio al servicio
	 * que recoje los datos hacia la base de datos.
	 */
	public async enviarFormulario() {
		//console.log(this.datosBasicos.value);

		//Validar los datos del formulario antes de enviarlos
		if (this.datosBasicos.invalid) {
			return Object.values(this.datosBasicos.controls).forEach((control) => {
				if (control instanceof FormGroup) {
					Object.values(control.controls).forEach((control) => control.markAsTouched());
				} else {
					control.markAsTouched();
				}
			});
		}

		//Posteo de la informacion
		Swal.fire({
			title: '¿Estás seguro de enviar la información?',

			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#ff3a28',
			cancelButtonColor: '#616161',
			confirmButtonText: 'Si, enviar',
			cancelButtonText: 'Cancelar',
			showLoaderOnConfirm: true,
			preConfirm: () => {
				return this._cs
					.postFormData(this.datosBasicos.value)
					.then((res) => {
						if (res.ok) {
							return res.body;
						} else {
							localStorage.setItem('fail', JSON.stringify(res));
							this.router.navigateByUrl('/result-fail', {
								state: {
									header: 400,
									subheader: message.error.subheader,
									message: message.error.message,
								},
							});
						}
					})
					.catch((error) => {
						this.router.navigateByUrl('/result-fail', {
							state: {
								header: 500,
								subheader: message.error.subheader,
								message: message.error.message,
							},
						});
					});
			},
		}).then((result) => {
			if (result.isConfirmed) {
				localStorage.removeItem('formulario');
				localStorage.removeItem('response');
				this.router.navigateByUrl('/result-ok', {
					state: message.form,
				});
			}
		});
		//GUARDAR en local Storage si fuere necesario volver a trás por un error
	}
	/**
	 * Metodo que verifica los cambios en los checkboxes para agregarlos al array de valores
	 * que se iràn incluyendo en el formulario
	 * @param e
	 */
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

	public onEdadhijosChage(e) {
		this.edadHijos.push(new FormControl(e.target.value));
	}

	public onChildrenChange(e) {
		let cuantosHijos: number = parseInt(e.target.value);

		if (cuantosHijos > 0) {
			this.cantidadHijos = Array(cuantosHijos).fill(4);
			if (this.edadHijos.length > 0) {
				while (this.edadHijos.length !== 0) {
					this.edadHijos.removeAt(0);
				}
			}
			return;
		} else {
			this.cantidadHijos = [];
			return;
		}
	}

	public onTipoMascotaChange(e) {
		this.tiposMascotas.push(new FormControl(e.target.value));
	}

	public onCuantasMascotasChange(e) {
		let cuantasMascotas: number = parseInt(e.target.value);

		if (cuantasMascotas > 0) {
			this.cantidadMascotas = Array(cuantasMascotas).fill(4);
			if (this.tiposMascotas.length > 0) {
				while (this.tiposMascotas.length !== 0) {
					this.tiposMascotas.removeAt(0);
				}
			}
			return;
		} else {
			this.cantidadMascotas = [];
			return;
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
		/**
		 * Seteo de lat lon para obtener la direcciòn exacta
		 */
		let checkArray: FormArray = this.datosBasicos.get('latLon') as FormArray;

		checkArray.reset();
		checkArray.push(new FormControl({ lat: place.geometry.location.lat() }));
		checkArray.push(new FormControl({ lng: place.geometry.location.lng() }));
	}
}
