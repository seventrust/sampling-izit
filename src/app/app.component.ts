import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicationService } from './services/comunication.service';
import { ServiceResponse } from './interfaces/service-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	//SWEETALERT FOR LOADING
	@ViewChild('loadingSwal') private loadingSwal: SwalComponent;
	//
	title = 'sampling-izitapp';
	response: any;
	queryParams: any;

	constructor(private _cs: ComunicationService, private router: Router, private activatedRoute: ActivatedRoute) {}

	ngOnInit(): void {}

	async ngAfterViewInit(): Promise<any> {
		this.activatedRoute.queryParams.subscribe((params) => {
			console.log(params);
			this.queryParams = params;
			this.saveResponseOnLocal();
		});
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
	}

	async saveResponseOnLocal() {
		//this.loadingSwal.fire();
		if (!localStorage.getItem('response')) {
			this._cs.getData(this.queryParams.access_token).subscribe(
				(data: ServiceResponse) => {
					console.log(data);
					if (data == null) {
						//console.log(`Error en la obtención de datos`);
						this.router.navigateByUrl('/result-fail');
						return;
					}
					localStorage.setItem('response', JSON.stringify(data));
					this.loadingSwal.dismiss().then(() => {
						this.router.navigateByUrl('/form');
					});
				},
				(error) => {
					this.router.navigateByUrl('/result-fail');
					//console.error(error);
				}
			);
		} else {
			this.loadingSwal.dismiss().then(() => {
				this.router.navigateByUrl('/form');
			});
		}
	}
}
