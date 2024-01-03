import { Injectable } from '@angular/core';
import { HttpClient, HttpParameterCodec } from '@angular/common/http';
import { ApplicationErreur } from '../model/application_errors';

@Injectable({
   providedIn: 'root'
})
export class BrowserService {

   constructor(private http: HttpClient) {
   }

   context(): string {
      const context = window.location.pathname.split('/')[0];
      if (context.indexOf('.html') >= 0) {
         return '/';
      }
      return '/' + context;
   }

   path(): string {
      let context = this.context();
      if (context.charAt(context.length - 1) === '/') {
         context = context.substr(0, context.length - 1);
      }
      return context;
   }

   url(path: string, prefix?: string): string {
      // let p = prefix;
      // if (!p) {
      //    p = '/ws';
      // }
      /*
            let url = this.path() + p + path;

            var characterJoin = url.indexOf('?') === -1 ? '?' : '&';
            let params = new HttpParams({encoder: new CustomHttpParamEncoder()});
            params = params.set('access_token', localStorage.getItem('access_token'));
            return [url, params.toString()].join(characterJoin);*/
      return this.path() + path;
   }

   ouvrirPdf(url: string, callbackFn?: any, errorCallbackFn?: any): void {
      // window.open(this.url(url));
      this.http.get(this.url(url), { observe: 'response', responseType: 'arraybuffer' }).subscribe(response => {
        if (response.headers.get('content-type')) {

          const data = window.URL.createObjectURL(new Blob([response.body], { type: response.headers.get('content-type') }));
          const link = document.createElement('a');
          link.href = data;
          link.target = '_blank';

          // Si cela n'est pas un pdf on va demander l'enregistrement du fichier
          if (response.headers) {
            const filenameAttribute = 'filename=';
            if (response.headers.get('content-type').indexOf('pdf') === -1 && response.headers.get('content-disposition') && response.headers.get('content-disposition').indexOf(filenameAttribute) !== -1) {
              link.download = response.headers.get('content-disposition').substring(response.headers.get('content-disposition').indexOf(filenameAttribute) + filenameAttribute.length).replace(/"/gm, '');
            }
          }
          link.click();
        }

         if (callbackFn) {
            callbackFn();
         }

      }, error => {
         if (errorCallbackFn) {
            errorCallbackFn(this.transformerReponseEnErreur(error));
         }
      });
   }

   /**
    * Permet de traiter les erreurs http.
    *
    * @param response la reponse de l'erreur à traiter.
    * @return l'erreur traitée convertie en format Json.
    */
   transformerReponseEnErreur(response): ApplicationErreur {
      const type = response.headers.get('content-type');
      if (!type?.startsWith('application/json')) {
         return response;
      }
      const decoder = new TextDecoder('utf-8');
      const domString = decoder.decode(response.error);
      return JSON.parse(domString);
   }
}

class CustomHttpParamEncoder implements HttpParameterCodec {
   encodeKey(key: string): string {
      return encodeURIComponent(key);
   }

   encodeValue(value: string): string {
      return encodeURIComponent(value);
   }

   decodeKey(key: string): string {
      return decodeURIComponent(key);
   }

   decodeValue(value: string): string {
      return decodeURIComponent(value);
   }
}
