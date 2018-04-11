import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(){
    if (localStorage.getItem('currentUser')){
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
