import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';

  constructor( private router: Router, private authService: AuthService ) { }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    this.authService.login(this.model.username);

    // this.authService.login(this.model.username)
    // .subscribe(result => {
    //   if (result === true) {
    //     this.router.navigate(['/game']);
    //   } else {
    //     this.error = 'Username or password is incorrect';
    //     this.loading = false;
    //   }
    // });
  }

}
