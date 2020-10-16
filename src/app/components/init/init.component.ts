import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicationService } from '../../services/comunication.service';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { message } from '../../responses/message-status';
import { DomSanitizer } from '@angular/platform-browser';
import { stringify } from '@angular/compiler/src/util';

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

	constructor(
		private _cs: ComunicationService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private sanitazer: DomSanitizer
	) {}

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
			this._cs.getData(this.queryParams).subscribe(
				(response: HttpResponse<ServiceResponse>) => {
					if (response) {
						console.log(response);
						//Redireccion al formulario para registrar a los usuarios
						//Se guardan los datos que vienen  del servicio en el localStorage
						//y se guardan los queryParams para acceder a ellos en otro flujo
						localStorage.setItem('response', JSON.stringify(response));
						localStorage.setItem('queryParams', JSON.stringify(this.queryParams));
						//Redireccio al formulario
						this.router.navigateByUrl('/form');
					}
				},
				(error) => {
					switch (error.status) {
						case 302:
							this.router.navigateByUrl('/result-ok', {
								state: {
									header: message.noemail.header,
									subheader: message.noemail.subheader,
									message: this.sanitazer.bypassSecurityTrustHtml(message.noemail.message),
								},
							});
							break;

						case 303:
							this.router.navigateByUrl('/result-ok', {
								state: {
									header: message.enrolled.header,
									subheader: message.enrolled.subheader,
									message: this.sanitazer.bypassSecurityTrustHtml(message.enrolled.message),
								},
							});
							break;

						case 400:
						case 404:
						case 500:
						case 502:
							//Un error de indisponibilidad del servicio
							this.router.navigateByUrl('/result-fail', {
								state: {
									header: error.status,
									subheader: message.error.subheader,
									message: this.sanitazer.bypassSecurityTrustHtml(message.error.message),
								},
							});
							break;

						default:
							this.router.navigateByUrl('/result-fail', {
								state: {
									header: error.status,
									subheader: 'Error Crítico',
									message: this.sanitazer.bypassSecurityTrustHtml(message.error.message),
								},
							});
							break;
					}
				}
			);
		} else {
			this.router.navigateByUrl('/form');
		}
	}
}
