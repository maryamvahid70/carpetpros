import { Component, OnInit } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular-legacy";
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { ModalPhonePanelComponent } from "../modal-phone-panel/modal-phone-panel.component";
import { TransferServices } from 'src/app/general/services/config.service';

@Component({
    selector: 'call-history-buttons',
    template: `
    <div *ngIf="params != undefined && params.type=='CUSTOMER'">
        <i class="flaticon-speech-bubble" (click)="onPhonePanel()" title="Phone Panel"></i>
    </div>
    <div *ngIf="params != undefined && params.type=='CFBtelAgent'">
        <i class="flaticon-phone-auricular" (click)="onDial()" title="Dial"></i>
    </div>
    
          `,
    styles: [
        `
        .flaticon-speech-bubble::before{
            margin: -9px;
            font-size: 16px;
            cursor: pointer;
        }

        .flaticon-phone-auricular::before{
            margin: -9px;
            font-size: 16px;
            cursor: pointer;
            color: #00c500;
        }
        
        `
    ]
})
export class CallHistoryButtonsComponent implements ICellRendererAngularComp, OnInit {

    public params: any;
    public loadingConfirm: boolean = false;

    ngOnInit() {

    }

    constructor(
        public bsModalRef: BsModalRef,
        private bsModalService: BsModalService,
        public transferServices: TransferServices) { }

    agInit(params: any): void {
        this.params = params.data;
    }

    refresh(): boolean {
        return false;
    }

    onPhonePanel() {
        const modalConfigDefaults: ModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        const initialState = {
            rowData: {
                OrderNo: this.params.keyfield,
                type: 'nav'
            }
        };
        this.bsModalRef = this.bsModalService.show(ModalPhonePanelComponent, Object.assign({ initialState }, modalConfigDefaults, { class: 'customClass-fit-content' })
        );
    }

    onDial(){
        this.transferServices.dialExtNo.next(this.params.Extension);
    }

}