import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../services/game.service';
import { Guess } from '../models/guess';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Input() guess: Guess;
  model: any = {};
  loading = false;
  error = '';

  constructor( private gameService: GameService ) { }

  ngOnInit() {
    this.guess = new Guess();
  }

  guessCard() {
    this.loading = true;
    console.log(this.guess.inputGuess);
    this.gameService.guess('static guess')
    .subscribe(result => {
      if (result === true) {
        // this.router.navigate(['/game']);
        this.loading = false;
      } else {
        this.error = 'Your guess was incorrect. :(';
        this.loading = false;
      }
    });
  }

}
