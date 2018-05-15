import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Guess } from '../models/Guess';

import * as io from 'socket.io-client';


@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = io();
    }

    public emitGuess(guess: String): void {
        this.socket.emit('guess', guess);
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
