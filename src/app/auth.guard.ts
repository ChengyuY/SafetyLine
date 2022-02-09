import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from "@angular/router";

// ng g guard auth

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(): boolean {
    console.log('Auth Guard!');
    const token = localStorage.getItem('user-token');
    if (!!token){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
