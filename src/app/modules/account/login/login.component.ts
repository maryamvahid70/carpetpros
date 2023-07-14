import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Common } from 'src/app/app.component';
import { AuthenticationService } from './authentication.service'
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalSignUpComponent } from '../modal-sign-up/modal-sign-up.component';
import { AppConfigService } from 'src/app/app-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  returnUrl: string = '';
  loading = false;
  isError: boolean = false;
  public currentVersion = Common.currentVersion;

  alert = {
    type: 'danger',
    msg: 'Username or password is incorrect.',
    exp: [],
  };

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private config:AppConfigService, 
    private common:Common
  ) {}

  public getLogOut() {
    this.authenticationService.logout();
  }

  onClosed() {
    this.isError = false;
  }

  ngOnInit() {
    // this.loginForm = formControlNameormBuilder.group({
    //   username: ['', Validators.required],
    //   password: ['', Validators.required]
    // });
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // get f() { return this.loginForm.controls; }

  onSubmit() {
    this.isError = false;
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    let body =
      'username=' +
      this.loginForm.get('username')?.value +
      '&password=' +
      this.loginForm.get('password')?.value +
      '&grant_type=password';
    this.loginForm.get('username')?.valid;
    Common.CallPostApi1(this.config.getAddress('BaseUrlToken'), this.http, body)
    
      .pipe(
        catchError((error) => {
          console.log('Tocken ERROR : ', error.error);
          this.alert.msg = error.error.error_description;
          this.isError = true;
          this.loading = false;
          return error;
        })
      )
      .subscribe((getTocken: any) => {
        Common.Tocken = 'Bearer ' + getTocken.access_token;
        this.authenticationService
          .login(
            this.loginForm.get('username')?.value,
            this.loginForm.get('password')?.value
          )
          .pipe(
            catchError((error) => {
              console.log('oops', error);
              this.alert.msg = error.error;
              this.alert.exp = error;
              this.isError = true;
              this.loading = false;
              return error;
            })
          )
          .subscribe((loginFromApi: any) => {
            if (loginFromApi) {
              Common.currentUser = loginFromApi;
              this.common.CallGetApi(
                this.http,
                Common.UrlLists.GetExtension + loginFromApi.AccountID
              )
                .pipe(
                  catchError((error) => {
                    console.log('Get Extension ERROR : ', error.error);
                    return error;
                  })
                )
                .subscribe((getExt) => {});

              this.router.navigate(['/home']);
              console.log('currentUser', loginFromApi);
            }
            this.loading = false;

            return loginFromApi;
          });
      });
  }

  signUpClick() {
    const modalConfigDefaults: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const initialState = {};
    this.bsModalRef = this.bsModalService.show(
      ModalSignUpComponent,
      Object.assign({ initialState }, modalConfigDefaults, {
        class: 'customClass',
      })
    );
  }
}
