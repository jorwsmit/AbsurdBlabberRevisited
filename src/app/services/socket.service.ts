import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Guess } from '../models/Guess';
import { User } from '../models/user';

import * as io from 'socket.io-client';


@Injectable()
export class SocketService {
  private socket;

  user: User;

  public initSocket(): void {
    this.socket = io('http://localhost:8080');
  }

  public login(username: String): Observable<Boolean> {
    return new Observable(observer => {
      this.socket.emit('login', username, function(result){
        if(result){
          this.user = {
            username: username,
            score: 0
          };
        }
        observer.next(result);
      });
    });
  }

  public emitGuess(guess: String): Observable<boolean>{
    return new Observable(observer => {
      this.socket.emit('guess', guess, function(result){
        observer.next(result);
      });
    });
  }

  public onGuess(): Observable<Guess> {
    return new Observable<Guess>(observer => {
      this.socket.on('guesses', (data: Guess) => observer.next(data));
    });
  }

  public onEvent(event: String): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
