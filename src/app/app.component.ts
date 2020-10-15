import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'sampling-izitapp';

	constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

	/**
	 * Se navega a un único componente que manejará la petición al servicio
	 */
	ngOnInit(): void {}

	ngAfterViewInit(): void {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
		this.activatedRoute.queryParams.subscribe(
			(params: Params) => {
				if (Object.keys(params).length !== 0) {
					this.router.navigate(['/init'], { queryParams: params });
					//this.router.navigateByUrl('/result-fail')
					//console.log(params);
				}
			},
			(error) => {
				console.error(error);
				this.router.navigateByUrl('/result-fail');
			}
		);
	}
}
