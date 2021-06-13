import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthPage } from './auth.page';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
