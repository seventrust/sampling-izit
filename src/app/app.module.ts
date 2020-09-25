import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { ResultOkComponent } from './components/result-ok/result-ok.component';
import { ResultFailComponent } from './components/result-fail/result-fail.component';
import { StepperExampleComponent } from './components/stepper-example/stepper-example.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';

@NgModule({
	declarations: [
		AppComponent,
		FormComponent,
		ResultOkComponent,
		ResultFailComponent,
		StepperExampleComponent,
		AutocompleteComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDqpl0ozSQ_YzgWHRQ8JhOqKYJRM0UjiKc', //'AIzaSyC6lHRoWRRk8STYv6FKyvRYXxn8Ttx-SYo',
			libraries: ['places'],
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
