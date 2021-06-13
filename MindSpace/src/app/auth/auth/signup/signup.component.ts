import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onClickSignup(signUpEmail, userPwd) {
    this.authService.signUp(signUpEmail.value, userPwd.value);
  }
}
