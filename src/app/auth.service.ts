import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Http ,HttpModule} from '@angular/http';

@Injectable()
export class AuthService {
  private url = 'http://localhost:4200';
  private socket;

  constructor() { }

  login(username: string){
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('login', username, function(response){
        return response;
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
