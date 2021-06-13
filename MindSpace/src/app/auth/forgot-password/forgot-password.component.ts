import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  resetPassword(value) {
    return this.authService
      .forgotPassword(value)
      .then(() => this.router.navigateByUrl('auth'));
  }

  ngOnInit() {}
}
