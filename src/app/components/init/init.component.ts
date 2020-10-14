import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicationService } from '../../services/comunication.service';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

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

	async saveResponseOnLocal() {
		if (!localStorage.getItem('response')) {
			this._cs.getData(this.queryParams).subscribe(
				async (data: ServiceResponse) => {
					//console.log(data);
					if (data == null) {
						//console.log(`Error en la obtención de datos`);
						this.router.navigateByUrl('/result-fail');
						return;
					}

					localStorage.setItem('response', JSON.stringify(data));
					localStorage.setItem('queryParams', JSON.stringify(this.queryParams));
					this.router.navigateByUrl('/form');
				},
				(error) => {
					console.error(error);
					this.router.navigateByUrl('/result-fail');

					//
				}
			);
		} else {
			this.router.navigateByUrl('/form');
		}
	}
}
