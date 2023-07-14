import { Component, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Common } from 'src/app/app.component';
import { TransferServices } from 'src/app/general/services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
// import { PlayRecordComponent } from 'src/app/ordr-mngmnt/order-call-history/order-call-history.component';
import { Subscription } from "rxjs";
import { CallHistoryButtonsComponent } from './call-history-btns.component';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'modal-call-history',
    templateUrl: './modal-call-history.html',
    styles: [`
        .dial-style::before{
            color: #00c500;
            margin: 0px;
            position: relative;
            top: 15px;
            font-size: 13px;
            cursor: pointer;
        }

        .telNo-textbox{
            border: none;
            border-bottom: 1px solid #949494;
            outline: unset;
            margin-left: 20px;
        }
    `]
})
export class ModalCallHistoryComponent implements OnInit {

    @ViewChild('audioOption', {static: false}) audioPlayerRef!: ElementRef;
    public datePipe = new DatePipe("en-US");
    public subscriptionPlayRecord: Subscription| undefined;
    public subscription: Subscription| undefined;
    public alertFlag: boolean = false;
    public DateVal = new Date();
    public gridApi: any;
    public gridColumnApi: any;
    public columnDefs;
    public defaultColDef;
    public rowData: any;
    public VoiceSrc: string = "";
    public downloadmessage: string = "For listen click play button .";
    public isClose: boolean = true;
    public rowGroupPanelShow;
    public autoGroupColumnDef;
    public loadSearchtBtn = false;
    public CFBtelAgentsData:any;
    public columnDefsCFBtelAgents;
    public gridApiCFBtelAgents: any;
    public telNoVal: string= '';
    public callSearch: any;
    public alertStatus = {
        msg: '',
        type: 'danger',
        exp: []
    }

    @Input()
    set onClose(onClose: boolean) {
        if (!onClose) {
            this.audioPlayerRef.nativeElement.pause();
            this.isClose = false;
        }
    }

    constructor(
        private http: HttpClient,
        public bsModalRef: BsModalRef,
        public transferServices: TransferServices,
        private common: Common) {

        this.defaultColDef = {
            resizable: true,
            sortable: true,
            enableRowGroup: true
        };

        this.rowGroupPanelShow = "always";

        this.autoGroupColumnDef = {
            minWidth: 200
        };

        this.columnDefs = [
            { headerName: "", field: "", cellRenderer: CallHistoryButtonsComponent, colId: "params", width: 40 },
            { field: "source", headerName: "Phone No", width: 80 , cellStyle: { padding: '0px' }, cellClass: 'link-style' },
            {
                field: "callername", headerName: "Name", width: 200 , cellStyle: { padding: '0px' },
                cellClass: function (params: any) {
                    if (params.data && params.data.callername != "UNKNOWN")
                        return "link-style";
                }
            },
            { field: "type", headerName: "Type" , width: 100, cellStyle: { padding: '0px' } },
            { field: "call_date", headerName: "Date" , width: 110, cellStyle: { padding: '0px' }, comparator: dateComparator },
            { field: "duration", headerName: "Duration", width: 70 , cellStyle: { padding: '0px' } },
            { headerName: 'IN/OUT', field: 'CallType' , width: 150, rowGroup: true, hide: true },
            { field: "disposition", headerName: "Disposition", width: 150 , cellStyle: { padding: '0px' }, rowGroup: true, hide: true },
            // { headerName: '', field: '' , cellRenderer: PlayRecordComponent, width: 100 }
        ]

        this.columnDefsCFBtelAgents =[
            { field: "Queue", headerName: "Queue" , width: 100, cellStyle: { padding: '0px' }, rowGroup: true, hide: true },
            { field: "Extension", headerName: "Extension" , width: 100, cellStyle: { padding: '0px' } },
            { field: "name", headerName: "Full Name" , width: 200, cellStyle: { padding: '0px' } },
            { headerName: "", field: "", cellRenderer: CallHistoryButtonsComponent, colId: "params", width: 60 }
        ]

    }

    ngOnInit() {
        this.onSubmit();
        this.GetCFBtelAgents();

        this.subscriptionPlayRecord = this.transferServices.callHistoryPlayRecord.subscribe((rowData) => {
            this.playAudio(rowData);
        })

        this.subscription = this.transferServices.dialExtNo.subscribe((extNo)=>{
            this.getDial(extNo);
        })
    }

    ngOnDestroy() {
        if (this.subscriptionPlayRecord)
            this.subscriptionPlayRecord.unsubscribe();
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    onGridReady(params: any) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    onGridReadyCFBtelAgents(params: any) {
        this.gridApiCFBtelAgents = params.api;
    }

    cellClicked(e: any) {
        if (e.colDef.field == "callername" && e.data.callername != '' && e.data.callername != "UNKNOWN") {
            let type = '';
            let key = '';
            if (e.data.type == "CUSTOMER") {
                key = e.data.keyfield;
                type = 'customer';
            }
            else if (e.data.type == 'STORE') {
                key = e.data.keyfield;
                type = 'store';
            }
            else if (e.data.type == 'INSTALLER') {
                key = e.data.keyfield;
                type = 'installer';
            }
            else {
                key = e.data.source;
                type = 'moreOrder';
            }

            let data = {
                type: type,
                key: key,
                isNotify: true
            }

            this.transferServices.openOrderForHome.next(data);
        }
        else if (e.colDef.field == "source" && e.data.source != '')
            this.getDial(e.data.source);
    }

    onSubmit() {
        if (this.gridApi)
            this.gridApi.showLoadingOverlay();
        this.loadSearchtBtn = true;
        this.alertFlag = false;
        let date = this.DateVal ? this.datePipe.transform(this.DateVal, 'yyyy-MM-dd') : '';
        let body = {
            "numbers": [Common.currentUser.extentionNo],
            "start_date": date,
            "end_date": date
        };
        this.callSearch= this.common.CallPostApi(this.http, Common.UrlLists.GetCallHistoryByPhoneNo, body)
        .pipe(
            catchError((error) => {
                if (this.gridApi)
                this.gridApi.showNoRowsOverlay();
            this.loadSearchtBtn = false;
            console.log("Get Call History By PhoneNo ERROR : ", error.error);
            this.alertStatus.exp = error;
            this.alertFlag = true;
              return error;
            })
          )
            .subscribe(getData => {
                getData.forEach((element: any) => {
                    element.call_date = this.datePipe.transform(element.call_date, Common.formatDateTime);
                });
                this.rowData = getData;
                if (this.gridApi) {
                    var gridApi = this.gridApi;
                    setTimeout(function () {
                        gridApi.forEachNode(function (node: any) {
                            if (node.field == "CallType") {
                                node.setExpanded(true);
                            }
                        });
                    }, 500);
                }
                if (this.gridApi)
                    this.gridApi.showNoRowsOverlay();
                this.loadSearchtBtn = false;
            })
    }

    onStopSearch(){
        this.callSearch.unsubscribe();
        this.loadSearchtBtn= false;
        this.gridApi.hideOverlay();
     }

    playAudio(data: any) {
        this.downloadmessage = "Downloadingsrc/app. Please wait."
        this.audioPlayerRef.nativeElement.pause();
        let splt1 = this.datePipe.transform(new Date(data.call_date), 'yyyy-MM-dd');
        let splt2 = splt1?.split('-');

        this.common.CallGetApi(this.http, Common.UrlLists.GetCallRecord + 
            data.unique_id + "&year=" + splt2![0] + "&month=" + splt2![1] + "&day=" + splt2![2])
            .pipe(
                catchError((error) => {
                    this.downloadmessage = error.error;
                    console.log("ERROR Get Monitoring Grid : ", error.error);
                  return error;
                })
              )
            .subscribe(getdata => {
                this.downloadmessage = "Downloaded."
                this.audioPlayerRef.nativeElement.src = "data:audio/wav;base64," + getdata;
                if (this.isClose)
                    this.audioPlayerRef.nativeElement.play();

            });
    }

    getDial(phoneNo: any) {
        this.alertFlag = false;
        let url = Common.UrlLists.CallCenterAPI + "OrgExtNo=" + Common.currentUser.extentionNo + "&CallerName=" + Common.currentUser.userName + "&DestExtNo=" + phoneNo;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': Common.Tocken
            })
        };
        this.http.get<any>(url, httpOptions)
        .pipe(
            catchError((error) => {
                console.log("Call Center API ERROR : ", error.error);
                this.alertStatus.type = 'danger';
                this.alertStatus.exp = error;
                this.alertFlag = true;
              return error;
            })
          )
            .subscribe(
                getDial => {
                    this.alertStatus.type = 'success';
                    this.alertStatus.msg = getDial;
                    this.alertFlag = true;
                })
    }

    GetCFBtelAgents() {
        this.common.CallGetApi(this.http, Common.UrlLists.GetCFBtelAgents)
        .pipe(
            catchError((error) => {
                console.log("ERROR Get CFBtel Agents : ", error.error);
              return error;
            })
          )
            .subscribe(getdata => {
                getdata.forEach((element: any) => {
                    element.type='CFBtelAgent';
                });
              this.CFBtelAgentsData= getdata;
            });
    }

}

function dateComparator(date1: string, date2: string) {

    var date1Number = _monthToNum(date1);
    var date2Number = _monthToNum(date2);
  
    if (date1Number === null && date2Number === null) {
      return 0;
    }
    if (date1Number === null) {
      return -1;
    }
    if (date2Number === null) {
      return 1;
    }
  
    return date1Number - date2Number;
  }
  
  // HELPER FOR DATE COMPARISON
  function _monthToNum(date: string): any {
    let datePipe = new DatePipe("en-US");
    let dte;
    if(date!='' && date!= null)
      dte= datePipe.transform(new Date(date), 'dd/MM/yyyy');
    else
      dte= null;
    if (dte === undefined || dte === null || dte.length !== 10) {
      return null;
    }
  
    var yearNumber = dte.substring(6, 10);
    var monthNumber = dte.substring(3, 5);
    var dayNumber = dte.substring(0, 2);
  
    var result = parseInt(yearNumber) * 10000 + parseInt(monthNumber) * 100 + dayNumber;
    // 29/08/2004 => 20040829
    return result;
  }