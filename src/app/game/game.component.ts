import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Guess } from '../models/guess';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // @Input() guess: Guess;
  // guess1: Guess;
  model: any = {};
  loading = false;
  error = '';

  constructor( private socketService: SocketService) { }

  ngOnInit() {
    // this.guess = new Guess();
  }

  guessCard() {
    this.loading = true;
    this.socketService.emitGuess(this.model.inputGuess)
    .subscribe(result => {
      if (result === true) {
        this.loading = false;
      } else {
        this.error = 'Your guess was incorrect. :(';
        this.loading = false;
      }
    });
  }

}
