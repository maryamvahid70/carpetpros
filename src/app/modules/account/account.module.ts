
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';

import { LoginComponent } from './login/login.component';
import { ModalSignUpComponent } from './modal-sign-up/modal-sign-up.component';
import { AuthenticationService } from './login/authentication.service';
import { CpAlertComponent } from '../../general/cp-alert.component';


@NgModule({
  declarations: [
    LoginComponent,
    ModalSignUpComponent,
    CpAlertComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    AuthenticationService
  ],
  exports: [
    MatInputModule,
  ]
})
export class AccountModule {}