import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-result-ok',
	templateUrl: './result-ok.component.html',
	styleUrls: ['./result-ok.component.css'],
})
export class ResultOkComponent implements OnInit {
	public status: any;
	constructor(private router: Router) {
		this.status = this.router.getCurrentNavigation().extras.state;
	}

	ngOnInit(): void {}
}
