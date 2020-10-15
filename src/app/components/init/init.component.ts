import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicationService } from '../../services/comunication.service';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { of } from 'rxjs';

@Component({
	selector: 'app-init',
	templateUrl: './init.component.html',
	styleUrls: ['./init.component.css'],
})
export class InitComponent implements OnInit {
	//SWEETALERT FOR LOADING
	@ViewChild('loadingSwal') private loadingSwal: SwalComponent;
	//
	title = 'sampling-izitapp';
	response: any;
	queryParams: any;

	constructor(private _cs: ComunicationService, private router: Router, private activatedRoute: ActivatedRoute) {}

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe(async (params) => {
			this.queryParams = params;
			this.saveResponseOnLocal();
		});
	}

	/**
	 * Metodo para solicitar los maestros para llenar el formulario con las
	 * opciones de los selects y además guardar el objeto de respuesta del
	 * servicio en el localStorage del navegador
	 */
	async saveResponseOnLocal() {
		if (!localStorage.getItem('response')) {
			this._cs
				.getData(this.queryParams)
				.then(async (data) => {
					console.log(data);
					if (data === null) {
						//Error en la obtención de datos
						this.router.navigateByUrl('/result-fail');
						return;
					}

					//Redireccion al formulario para registrar a los usuarios
					//Se guardan los datos que vienen  del servicio en el localStorage
					//y se guardan los queryParams para acceder a ellos en otro flujo
					localStorage.setItem('response', JSON.stringify(data));
					localStorage.setItem('queryParams', JSON.stringify(this.queryParams));
					//Redireccio al formulario
					this.router.navigateByUrl('/form');
					/* } else if (data.status == 302) {
						//Redireccion a la ruta OK para participantes que ya cumplieron con todo el
						//proceso de registro
						this.router.navigateByUrl('/result-ok', {
							state: {
								header: 'Gracias por participar',
								message: 'Hola, ya te encuentras participando en <b>Izit Influencers</b>',
							},
						});
					} else if (data.status == 400) {
						this.router.navigateByUrl('/result-fail');
					} */
				})
				.catch((error) => {
					console.error(error);
					this.router.navigateByUrl('/result-fail');

					//
				});
		} else {
			this.router.navigateByUrl('/form');
		}
	}
}
