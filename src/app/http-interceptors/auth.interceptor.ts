import {Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private router: Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if login, add no-auth in headers
    if (req.headers.get('No-auth') === 'TURE'){
      return next.handle(req);
    }
    // if not login, add auth in headers
    console.log('HttpInterceptor!');
    const token = localStorage.getItem('user-token');
    const authReq = req.clone(
      {
        headers: req.headers.set('Authorization',`Bearer ${token}`)
      }
    );
    return next.handle(authReq).pipe(
      tap(
        () =>{},
        error => {
          if (error.status === 401 || error.status === 0) {
            localStorage.removeItem('user-token');
            localStorage.removeItem('username-token');
            localStorage.removeItem('role-token');
            localStorage.removeItem('email-token');
            localStorage.removeItem('id-token');
            this.router.navigate(['/login']);
          }
        }
      )
    );
  }
}
