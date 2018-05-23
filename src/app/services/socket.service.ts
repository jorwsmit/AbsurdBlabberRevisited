import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Guess } from '../models/Guess';
import { User } from '../models/user';
import { Card } from '../models/card';
import { GuessResult } from '../models/guessResult';

import * as io from 'socket.io-client';


@Injectable()
export class SocketService {
  private socket;

  users: Array<User>;
  user: User;
  card: Card;
  guessResult: GuessResult;

  public initSocket(): void {
    this.socket = io('http://localhost:8080');
  }

  public login(username: String): Observable<Boolean> {
    return new Observable(observer => {
      this.socket.emit('login', username, function(result){
        observer.next(result);
      });
    });
  }

  public getCurrentCard(): Observable<Card> {
    return new Observable(observer => {
      this.socket.emit('getCurrentCard', function(card){
        this.card = card;
        observer.next(this.card);
      });
    });
  }

  public getCurrentUsers(): Observable<Array<User>> {
    return new Observable(observer => {
      this.socket.emit('getCurrentUsers', function(users){
        this.users = users;
        observer.next(this.users);
      });
    });
  }

  public emitGuess(guess: String): Observable<GuessResult>{
    return new Observable(observer => {
      this.socket.emit('guess', guess, function(result){
        this.guessResult = result;
        observer.next(this.guessResult);
      });
    });
  }

  public onGuess(): Observable<Guess> {
    return new Observable<Guess>(observer => {
      this.socket.on('guesses', (data: Guess) => observer.next(data));
    });
  }

  public onUsers(): Observable<Array<User>> {
    return new Observable<Array<User>>(observer => {
      this.socket.on('onUsers', (data: Array<User>) => observer.next(data));
    });
  }

  public onCard(): Observable<Card> {
    return new Observable<Card>(observer => {
      this.socket.on('onCard', function(card){
        observer.next(card);
      });
    });
  }

  public onEvent(event: String): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
