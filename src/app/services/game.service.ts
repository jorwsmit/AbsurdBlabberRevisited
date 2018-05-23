import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Http ,HttpModule} from '@angular/http';

@Injectable()
export class GameService {

  private socket;

  constructor() { }

  guess(guess: string): Observable<boolean>{
    return new Observable(observer => {
      this.socket = io('http://localhost:8080');
      this.socket.emit('guess', guess, function(result){
        observer.next(result);
      });
    });
  }

}