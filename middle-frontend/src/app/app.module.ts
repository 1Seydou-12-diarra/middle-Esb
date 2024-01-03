
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {LOCALE_ID, NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiUrlInterceptor } from './modules/shared/interceptors/api-url.interceptor';
import { JwtInterceptor } from './modules/shared/interceptors/jwt.interceptor';
import { AuthService } from './modules/shared/service/auth.service';
import { SharedModule } from './modules/shared/shared.module';

import {PasswordModule} from "primeng/password";
import {MessageModule} from "primeng/message";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from "@angular/common";
registerLocaleData(localeFr);
export function tokenGetter(): string {
	const token = localStorage.getItem('token');
	return token ? token : '';
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    PasswordModule,
    MessageModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    ProgressSpinnerModule,
    BrowserAnimationsModule,
    
    JwtModule.forRoot({
			config: {tokenGetter: tokenGetter}
		}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [JwtHelperService,
        {provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true},
		    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: LOCALE_ID, useValue: 'fr-FR'},
		    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translateService: TranslateService, private primeNGConfig: PrimeNGConfig) {
    this.translateService.setDefaultLang('FR');
    this.translateService.use('FR');
    this.translateService.stream('COMPONENTS.CALENDAR').subscribe(data => {
      this.primeNGConfig.setTranslation(data);
    });
  }
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
