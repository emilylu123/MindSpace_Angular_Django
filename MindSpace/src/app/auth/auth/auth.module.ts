import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AlertComponent } from '../../alert/alert.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthPageRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AuthPageRoutingModule],
  declarations: [
    AuthPage,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent,
    AlertComponent,
  ],
})
export class AuthPageModule {}
