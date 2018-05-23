import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Guess } from '../models/guess';
import { Card } from '../models/card';
import { User } from '../models/user';
import { GuessResult } from '../models/guessResult';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';
  success = '';
  showAnswer = false;
  users: Array<User>;
  card: Card;
  guessResult: GuessResult;
  // onCard: any;

  constructor( private socketService: SocketService) { }

  ngOnInit() {
    // this.guess = new Guess();
    this.card = {
    question: null,
    answer: null
  };

  this.socketService.onCard()
  .subscribe((card: Card) => {
    if(card.answer) this.showAnswer = true;
    else this.showAnswer = false;
    this.card = card;
  });

  this.socketService.onUsers()
  .subscribe((users: Array<User>) => {
    this.users = users;
  });

  this.socketService.getCurrentCard()
  .subscribe((card: Card) => {
    if(card.answer) this.showAnswer = true;
    else this.showAnswer = false;
    this.card = card;
    this.loading = false;
  });

  this.socketService.getCurrentUsers()
  .subscribe((users: Array<User>) => {
    this.users = users;
  });
}

guessCard() {
  this.loading = true;
  this.socketService.emitGuess(this.model.inputGuess)
  .subscribe(result => {
    this.guessResult = result;
    this.error = '';
    if (this.guessResult.correct === true) {
      this.success = this.guessResult.alert;
      setTimeout( () => {
        this.success = '';
      }, 3500);
    } else {
      this.error = this.guessResult.alert;
      this.success = '';
      setTimeout( () => {
        this.error = '';
      }, 3500);
    }
    this.loading = false;
  });
}

}
