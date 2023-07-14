import { Component, OnInit,Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransferServices } from './services/config.service';

export interface DialogData {
    msg: string;
    exp: any;
    type: string;
  }

@Component({
    selector: 'cp-alert-btn',
    template: `
    <h1 *ngIf="data.type != 'question'" mat-dialog-title class="header-style"
    [class.error-style]="data.type == 'danger'"
    [class.success-style]="data.type == 'success'"
    [class.null-style]="data.type == 'not'">{{header}}</h1>
    <div mat-dialog-content class="mat-dialog-content">
        <i *ngIf="data.type == 'question'" class="flaticon-question"></i>
      {{data.msg}}
    </div>
    <div *ngIf="data.type != 'question'" mat-dialog-actions class="mat-dialog-actions">
      <button mat-button (click)="onCloseClick()" class="btn-close">Close</button>
    </div>
    <div *ngIf="data.type == 'question'" mat-dialog-actions class="mat-dialog-actions row">

        <button mat-raised-button color="primary" style="margin-left: 17px;margin-bottom: 5px;" 
        (click)="onQuestion('CreateNewAccount')"> Create new account </button>

        <button mat-raised-button color="primary" style="margin-left: 17px;margin-bottom: 5px;" 
        (click)="onQuestion('SelectExistAccount')">Select existing account</button>

    </div>

    `,
    styles: [
        `
        .error-style{
            background-color:red;
        }

        .success-style{
            background-color:green;
        }

        .null-style{
            display: none;
        }

        .header-style{
            color: white;
            text-align: center;
            font-size: 15px;
            font-weight: bold;
        }
        .mat-dialog-content {
            margin: 10px;
            padding: 0px;
        }
        
        .mat-dialog-actions {
            margin-bottom: 0px;
            margin-left: 10px;
        }

        .btn-close{
            background-color: #d6d6d6;
            border: 1px #b1b1b1 solid;
        }

        .flaticon-question::before{
            margin: 3px;
            font-size: 30px;
            margin-right: 7px;
            color: #ff7600;
        }
        
        `
    ]
})
export class CpAlertBtnComponent implements OnInit {

    public header: string='';

    constructor(public dialogRef: MatDialogRef<CpAlertBtnComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public transferServices:TransferServices) { }

    ngOnInit() {
         
        if (this.data.type == "danger") {
            this.header = "ERROR"
        }else if(this.data.type == "success"){
            this.header = "Successfull"
        }

        if (this.data.msg == "" || this.data.msg == undefined || this.data.msg == null) {
            if (this.data.exp != "" && this.data.exp != null && this.data.exp != undefined &&
                this.data.exp.error != "" && this.data.exp.error != null && this.data.exp.error != undefined
            ) {
                this.data.msg = this.data.exp.error;
                if (this.data.exp.error.message != "" && this.data.exp.error.message != null && this.data.exp.error.message != undefined)
                    this.data.msg += this.data.exp.error.message;
            } else {
                if (this.data.exp.message != null || this.data.exp.message != undefined || this.data.exp.message != "")
                    this.data.msg = this.data.exp.message;
                else
                    this.data.msg = "Unknown Exception";
            }
        }
    }

    onCloseClick(): void {
        this.dialogRef.close();
      }

    onQuestion(type:string){
        this.transferServices.openCreateAccountForTeam.next(type);
        this.dialogRef.close();
    }

}