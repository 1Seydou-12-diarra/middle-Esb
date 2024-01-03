import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "src/environments/environment";

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
  apiUrl = environment.apiUrl;
  apiUrl2 = environment.apiUrl2;
  url = environment.url;

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      url: this.preparerUrl(request.url),
      withCredentials: true,
      setHeaders: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Expose-Headers': 'Authorization',
      }
    });
    return next.handle(request);
  }

  /**
   * Prépare l'url à exécuter en remplaçant éventuellement le domaine.
   * @param url l'url à exécuter.
   * @private
   */
  private preparerUrl(url: string): string {
    if (url.includes('assets')) {
      return url;
    }

    url = this.isAbsoluteUrl(url) ? url : (url.includes('api') ? this.apiUrl : this.apiUrl2) + '/' + url;
    return url.replace(/([^:]\/)\/+/g, '$1');
  }

  /**
   * Retourne true s'il s'agit d'une url complète c'est-à-dire qu'elle contient http.
   * @param url l'url à tester.
   * @private
   */
  private isAbsoluteUrl(url: string): boolean {
    const absolutePattern = /^http?:\/\//i;
    return absolutePattern.test(url);
  }
}
