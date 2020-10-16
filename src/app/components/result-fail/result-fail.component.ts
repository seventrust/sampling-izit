import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-result-fail',
	templateUrl: './result-fail.component.html',
	styleUrls: ['./result-fail.component.css'],
})
export class ResultFailComponent implements OnInit {
	status: any;
	constructor(private router: Router) {
		this.status = this.router.getCurrentNavigation().extras.state;
	}

	ngOnInit(): void {}
}
