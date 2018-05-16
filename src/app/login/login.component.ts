import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';
  ioConnection: any;
  user: User;

  constructor( private router: Router, private socketService: SocketService ) { }

  ngOnInit() {
    this.socketService.initSocket();
  }

  login() {
    this.loading = true;
    this.socketService.login(this.model.username)
    .subscribe(result => {
      if (result === true) {
        this.router.navigate(['/game']);
      } else {
        this.error = 'Username didn\'t work. :( \n You should try another one!';
        this.loading = false;
      }
    });
  }

}
