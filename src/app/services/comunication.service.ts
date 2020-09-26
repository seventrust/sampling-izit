import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map }  from 'rxjs';
@Injectable({
	providedIn: 'root',
})
export class ComunicationService {
	/**
	 * Definiocion de variables globales
	 */
	response: any // Por Ahora lo dejamos con ANY debemos fabricar el interface
	apiKey: string = 'AlgunaApiKeyQuePodamosDefinir';
	constructor(private _client: HttpClient) {}

	/**
	 * Obtener los datos para rellenar los selects o los checkboxes en
	 * la vista del formulario
	 */
	public async getData() {
		this._client.get(`https://laurlquevienedelservicio.izitapp.com/form-data`, {
			headers: {
				AccessControl: '*',
				ApiHeader: 'AlgunaApiKeyDeComunicacion',
			},
		})
		.pipe(map((res: any) => this.response = res));
	}

	public async postFormData(form: FormData) {
		return this._client.post(`https://algunaapigateway.izitapp.com/form-data`, form, {
			headers: {
				AccessControl: '*',
				ApiHeader: 'AlgunaApiKeyDeComunicacion',
			},
		})
		.pipe(map((res: any) => this.response = res));
	}
}
