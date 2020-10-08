/**
 * Interface para manejar el tipo (tipo de dato) de la solicitud
 * que se realiza al servicio de guardar las respuestas del usuario
 */
export interface RequestSampling {
	userId?: number;
	userRut: string;
	userName: string;
	userLastName: string;
	genId: number;
	birthday: string;
	messageId?: number;
	mmsId: number; //Estado Civil
	mcaId: number; //Actividad Actual
	eduId: number; //Nivel De Educuacion
	dcpId: number; //Vive con
	dstId: number; //Vive en
	email: string;
	address: string;
	addressNumber: string;
	addressHomeType: string;
	homeType: string;
	commune: string;
	region: string;
	sportPractice: boolean;
	sportFrecW: number;
	haveChildren: boolean;
	children: number;
	childrenAge: any[];
	havePets: boolean;
	pets: number;
	petsType: any[];
	content: any[]; //Contenido que consume
	category: any[];
	internetHome: boolean;
	ispId: number;
	videoContent: any[];
	socialMedia: any[];
	rut?: string;
	latLon?: any[] /* [
	  {
		"lat": -33.49844849999999
	  },
	  {
		"lng": -70.5865202
	  }
	] */;
}
