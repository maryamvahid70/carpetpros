import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Common } from 'src/app/app.component';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-modal-sign-up',
  templateUrl: './modal-sign-up.component.html',
  styleUrls: ['./modal-sign-up.component.scss']
})
export class ModalSignUpComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  alertFlag: boolean = false;
  public alert: any;
  public isErrorPass:boolean=false;
  public loadSubmitBtn:boolean=false;

  constructor(public bsModalRef: BsModalRef, public formBuilder: FormBuilder,
    public http: HttpClient, private common:Common) { }

  ngOnInit() {
    this.alert = {
      type: 'danger',
      msg: '',
      exp:[]
    }
  }

  FirstName = new FormControl('', [Validators.required]);
  LastName = new FormControl('', [Validators.required]);
  Email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  UserName = new FormControl('', [Validators.required]);
  Password = new FormControl('', [Validators.required]);
  ConfirmPassword = new FormControl('', [Validators.required]);
  Address = new FormControl('');
  MobileNumber = new FormControl('');
  PhoneNumber = new FormControl('');
  // PersonalId = new FormControl('');


  onSubmit() {
    this.loadSubmitBtn=true;
    if(this.UserName.valid && this.Password.valid && this.Email.valid && 
      this.FirstName.valid && this.LastName.valid && this.ConfirmPassword.valid){
    let body = {
      "userName": this.UserName.value,
      "password": this.Password.value,
      "companyName": "",
      "email": this.Email.value,
      "FirstName": this.FirstName.value,
      "LastName": this.LastName.value,
      "Phone": this.PhoneNumber.value,
      "Address": this.Address.value,
      "Mobile": this.MobileNumber.value,
      "personalId": ""
    }
    this.common.CallPostApi(this.http, Common.UrlLists.SignUp, body)
    .pipe(
      catchError((error) => {
        this.alert.message=error;
        this.alertFlag = true;
        console.log(error.error.message);
        this.loadSubmitBtn=false;
        return error;    
      })
    )
      .subscribe(getSignUp => {
        this.alert.type = "success";
        this.alert.msg = "Success";
        this.alertFlag = true;
        this.loadSubmitBtn=false;
      })
    }
    else{
      this.alert.type = "danger";
      this.alert.msg = "INVALID";
      this.alertFlag = true;
      this.loadSubmitBtn=false;
    }
  }

  confirmPassErr(){
    if(this.Password.value == this.ConfirmPassword.value)
    this.isErrorPass= false;
    else
    this.isErrorPass= true;
  }

  clickOutEvent(){
    this.confirmPassErr();
  }

}
