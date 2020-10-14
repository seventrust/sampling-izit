import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { ResultOkComponent } from './components/result-ok/result-ok.component';
import { ResultFailComponent } from './components/result-fail/result-fail.component';
import { InitComponent } from './components/init/init.component';

const routes: Routes = [
	{ path: 'init', component: InitComponent },
	{ path: 'form', component: FormComponent },
	{ path: 'result-ok', component: ResultOkComponent },
	{ path: 'result-fail', component: ResultFailComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
