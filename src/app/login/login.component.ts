import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';

  constructor( private router: Router, private socketService: SocketService ) { }

  ngOnInit() {
    this.socketService.initSocket();
  }

  login() {
    this.loading = true;
    this.socketService.login(this.model.username)
    .subscribe(result => {
      this.socketService.user = {
        username: this.model.username,
        score: 0
      };
      if (result === true) {
        this.router.navigate(['/game']);
      } else {
        this.error = 'Username didn\'t work. :( \n You should try another one!';
        this.loading = false;
      }
    });
  }

}
