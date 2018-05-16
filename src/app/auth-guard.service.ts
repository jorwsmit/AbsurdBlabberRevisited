import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SocketService } from './services/socket.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private socketService: SocketService) { }

  canActivate(){
    if (this.socketService.user){
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
