import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
/***********MODULOS DE LA APLICACION ***********/
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
//*******COMPONENTES *********************/
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { ResultOkComponent } from './components/result-ok/result-ok.component';
import { ResultFailComponent } from './components/result-fail/result-fail.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
/********Variables de Entorno *************/
import { environment } from '../environments/environment';
import { FORMAT } from './format-date';
import { InitComponent } from './components/init/init.component';

@NgModule({
	declarations: [AppComponent, FormComponent, ResultOkComponent, ResultFailComponent, AutocompleteComponent, InitComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		HttpClientJsonpModule,
		BrowserAnimationsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatMomentDateModule,
		AgmCoreModule.forRoot({
			apiKey: environment.googleApi, //'AIzaSyC6lHRoWRRk8STYv6FKyvRYXxn8Ttx-SYo',
			libraries: ['places'],
		}),
		SweetAlert2Module.forRoot(),
	],
	providers: [
		{ provide: MAT_DATE_FORMATS, useValue: FORMAT },
		{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
