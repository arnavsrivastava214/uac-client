import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {

    const token = this.authService.getToken();
  
    const authReq = token
      ? request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })
      : request;
  
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
  
        if (err.status === 401) {
          this.authService.logout();
        }
  
        return throwError(() => err);
      })
    );
  }
  
}