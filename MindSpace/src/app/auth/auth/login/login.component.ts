import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public alertController: AlertController,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  onClickLogin(userName, userPassword) {
    this.authService.signIn(userName.value, userPassword.value);
  }
}
