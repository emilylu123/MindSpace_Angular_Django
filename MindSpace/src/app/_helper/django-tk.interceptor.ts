import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class DjangoTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.authService.isLoggedIn &&
      request.url.includes(this.authService.djangoUrl)
    ) {
      let djangoToken = this.authService.djangoToken;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${djangoToken}`,
        },
      });
    }
    return next.handle(request); //pass the modified request to the next handler (the last one is the default HttpBackend handler)
  }
}
