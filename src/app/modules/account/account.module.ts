
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { LoginComponent } from './login/login.component';
import { ModalSignUpComponent } from './modal-sign-up/modal-sign-up.component';
import { AuthenticationService } from './login/authentication.service';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [
    LoginComponent,
    ModalSignUpComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    SharedModule
  ],
  providers: [
    AuthenticationService
  ],
  exports: [
    MatInputModule,
  ]
})
export class AccountModule {}