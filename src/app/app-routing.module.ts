import { NgModule , OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/account/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './_guards/auth.guard';
// import { CustomerConfirmPageComponent } from './customer-confirm-page.component';

const routes: Routes = [
  { path: '',  component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  // { path: 'confirm/:GoId', component: CustomerConfirmPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule implements OnInit {

  ngOnInit(){
  
  }

 }
