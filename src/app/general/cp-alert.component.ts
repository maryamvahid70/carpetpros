import { Component , OnInit , Input } from "@angular/core";

@Component({
    selector: 'cp-alert',
    template: `
    <alert [type]="alertStt.type">{{ alertStt.msg }}</alert>
    `,
    styles: [
        `
        `
    ]
})
export class CpAlertComponent implements OnInit {


    @Input('alertStatus') alertStt: any;
  
    constructor() { }

    ngOnInit() {
         
        if (this.alertStt.msg == "" || this.alertStt.msg == undefined || this.alertStt.msg == null) {
            if (this.alertStt.exp != "" && this.alertStt.exp != null && this.alertStt.exp != undefined &&
                this.alertStt.exp.error != "" && this.alertStt.exp.error != null && this.alertStt.exp.error != undefined
                //&& this.alertStt.exp.error.message != "" && this.alertStt.exp.error.message != null && this.alertStt.exp.error.message != undefined
            ) {
                this.alertStt.msg = this.alertStt.exp.error;
                if (this.alertStt.exp.error.message != "" && this.alertStt.exp.error.message != null && this.alertStt.exp.error.message != undefined)
                    this.alertStt.msg += this.alertStt.exp.error.message;
            } else {
                if (this.alertStt.exp.message != null || this.alertStt.exp.message != undefined || this.alertStt.exp.message != "")
                    this.alertStt.msg = this.alertStt.exp.message;
                else
                    this.alertStt.msg = "Unknown Exception";
            }
        }else if(this.alertStt.msg &&  this.alertStt.msg.Message&& this.alertStt.msg.Message !=''){
            this.alertStt.msg=this.alertStt.msg.Message;
        }else if(this.alertStt.msg){
            this.alertStt.msg=this.alertStt.msg;
        }
    }
}