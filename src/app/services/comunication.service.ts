import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { RequestSampling } from '../interfaces/request-samplig.interface';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { clean } from 'rut.js';
import { query } from '@angular/animations';
@Injectable({
	providedIn: 'root',
})
export class ComunicationService {
	/**
	 * Definiocion de variables globales
	 */
	response: ServiceResponse;

	//Se inyecta el modulo para peticiones Http
	constructor(private _client: HttpClient) {}

	/**
	 * Obtener los datos para rellenar los selects o los checkboxes en
	 * la vista del formulario
	 */
	public getData(queryParams): Observable<ServiceResponse> {
		if (environment.production) {
			return this._client.get<ServiceResponse>(`${environment.apiUrl}/prod/sampling/v1/survey`, {
				params: {
					access_token: queryParams.accesstoken,
					userId: queryParams.userId,
					messageId: queryParams.messageId, //'c15a690d1389b9ee2872642dd63ca760b6b37456',
				},
			});
		} else if (!environment.production && environment.localDev) {
			return this._client.get<ServiceResponse>(`dev/sampling/v1/survey`, {
				params: {
					access_token: queryParams.accesstoken,
					userId: queryParams.userId,
					messageId: queryParams.messageId,
				},
			});
		} else if (!environment.production && !environment.localDev) {
			return this._client.get<ServiceResponse>(`${environment.apiUrl}/dev/sampling/v1/survey`, {
				params: {
					access_token: queryParams.accesstoken,
					userId: queryParams.userId,
					messageId: queryParams.messageId, //'c15a690d1389b9ee2872642dd63ca760b6b37456',
				},
			});
		}
	}

	/**
	 * Enviar el formulario al servicio para persistir
	 * @param data
	 */
	public postFormData(data: any): Observable<HttpResponse<RequestSampling>> {
		//TODO:
		//Recolectar el localStorage el userId, messageId y accessToken
		let queryParms = JSON.parse(localStorage.getItem('queryParams'));
		let reqData: RequestSampling = {
			userId: queryParms.userId,
			userRut: clean(data.rut),
			userName: data.nombre,
			userLastName: data.apellido,
			genId: data.genero,
			birthday: moment(data.fechaNacimiento).format('YYYY-MM-DD'),
			messageId: queryParms.messageId,
			mmsId: parseInt(data.estadoCivil),
			mcaId: parseInt(data.profesion),
			eduId: parseInt(data.educacion),
			dcpId: parseInt(data.viveCon),
			dstId: parseInt(data.residencia),
			email: data.email,
			address: data.direccion,
			addressNumber: data.dirNum,
			homeType: 'Ya existe el campo para ello',
			addressHomeType: data.oficina,
			commune: data.ciudad,
			region: data.estado,
			sportPractice: data.deportes,
			sportFrecW: parseInt(data.deporteFrecuencia),
			haveChildren: data.tieneHijo,
			children: data.cuantosHijos,
			childrenAge: data.edadHijos,
			havePets: data.mascota,
			pets: data.cuantasMascotas,
			petsType: data.tiposMascota,
			content: data.contenido,
			category: data.preferencias,
			internetHome: data.tieneInternet,
			ispId: data.proveedorServicio,
			videoContent: data.plataformas,
			socialMedia: data.redes,
			rut: data.rut,
			latLon: data.latLon,
		};
		console.log('DATA ENVIADA: ' + JSON.stringify(reqData));

		if (environment.production) {
			return this._client.post<RequestSampling>(`${environment.apiUrl}/prod/sampling/v1/survey`, reqData, {
				observe: 'response',
			});
		} else if (!environment.production && environment.localDev) {
			return this._client.post<RequestSampling>(`dev/sampling/v1/survey`, reqData, {
				observe: 'response',
			});
		} else if (!environment.production && !environment.localDev) {
			return this._client.post<RequestSampling>(`${environment.apiUrl}/dev/sampling/v1/survey`, reqData, {
				observe: 'response',
			});
		}
	}

	checkForServiceResponse(): boolean {
		if (localStorage.getItem('response')) {
			return true;
		}
		return false;
	}

	getResponse(): ServiceResponse {
		return this.response;
	}
}
