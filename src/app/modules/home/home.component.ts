import { Component, OnInit, Input, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/account/login/authentication.service';
import { Common } from 'src/app/app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
// import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component'
import { TransferServices } from 'src/app/general/services/config.service';
// import { SignalRService } from '../signalR-service';
import { NotificationService, NotificationRef } from '@progress/kendo-angular-notification';
import { Router, RouteReuseStrategy } from '@angular/router';
import { Subscription } from "rxjs";
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PanelBarExpandMode } from "@progress/kendo-angular-layout";

@Component({
  selector: 'notificationCall-component',
  template: `

  <i class="flaticon-cancel" (click)="ignoreNotification(notifyData)"></i>

  <i *ngIf="notifyData.CallType == 'INCOMINGCALL'" class="flaticon-call" title="INCOMING CALL"></i>
  
  <i *ngIf="notifyData.CallType == 'ANSWERED' || notifyData.CallType == 'MISSCALL'" 
  [class.icon-answer]="notifyData.CallType == 'ANSWERED' || isMakeCall"
  [class.icon-misscall]="notifyData.CallType == 'MISSCALL'"
  class="flaticon-phone-auricular" title="{{notifyData.CallType}}"></i>

  <i *ngIf="isMakeCall" [class.icon-answer]="isMakeCall" class="flaticon-phone-auricular" title="Make Call"></i>

  <i *ngIf="notifyData.Type == 'CUSTOMER'" class="flaticon-account-1 custom-style-notify"></i>
  <i *ngIf="notifyData.Type == 'STORE'" class="flaticon-approve custom-style-notify"></i>
  <i *ngIf="notifyData.Type == 'INSTALLER'" class="flaticon-admin-with-cogwheels custom-style-notify"></i>
  <i *ngIf="notifyData.Type == 'UNKNOWN'" class="flaticon-error custom-style-notify"></i>
  <h5 class="notify-customer-name">{{notifyData.CallerName}}</h5><br>
  <span class="span-notify" style="margin-left: 60px;">{{notifyData.Type}}</span><br><br>
  <span class="span-notify">{{notifyData.CallerNo}}</span><br><br>
  <span *ngIf="notifyData.Type == 'CUSTOMER'" class="link-style" style="font-size: 15px;" (click)="openOrderMng('customer',notifyData.Key)">{{notifyData.Key}}<br><br></span>
  <span *ngIf="notifyData.Type == 'STORE'" class="link-style" style="font-size: 15px;" (click)="openOrderMng('store',notifyData.Key)">{{notifyData.Key}}<br><br></span>
  <span *ngIf="notifyData.Type == 'INSTALLER'" class="link-style" style="font-size: 15px;" (click)="openOrderMng('installer',notifyData.Key)">{{notifyData.Key}}<br><br></span>
  <span *ngIf="notifyData.Type == 'CUSTOMER'" class="link-style" style="font-size: 15px;" (click)="openOrderMng('moreOrder',notifyData.CallerNo)">More Order<br><br></span>
  <span *ngIf="notifyData.CallType == 'MISSCALL'" class="link-style" style="font-size: 15px;" (click)="makeCallClick()">Make Call<br><br></span>
  <span *ngIf="navigateMsg1 != ''" class="navigate-msg-style">{{navigateMsg1}}<br></span>
  <span *ngIf="navigateMsg2 != ''" class="navigate-msg-style">{{navigateMsg2}}</span>

  `,
  styles: [`
  .custom-style-notify::before{
    font-size: 40px;
    color: darkgray;
  }
  .custom-style-notify{
      left: 0px;
      top: 17px;
      right: 0px;
      position: absolute;
      margin-right: 10px;
      margin-top: 3px;
      cursor: pointer;
      width: fit-content !important;
  }
  .notify-customer-name{
    display: inline;
    margin-left: 60px;
    margin-right: 10px;
  }
  .span-notify{
    font-size: 13px;
  }
  .icon-misscall::before{
    color: red;
  }
  .icon-answer::before{
    color: #019e01;
  }
  .flaticon-call::before,
  .flaticon-phone-auricular::before{
    font-size: 25px;
  }
  .flaticon-call,
  .flaticon-phone-auricular{
    transform: rotate(270deg);
    display: inline-block;
    position: absolute;
    left: 5px;
    top: 13px;
    z-index: 10;
  }

  .navigate-msg-style{
    color: red;
  }

  .flaticon-cancel:before {
    font-size: 13px;
  }

  .flaticon-cancel{
    right: 3px;
    position: absolute;
    cursor: pointer;
  }
  
  `]
})

export class NotificationCallComponent {

  public isMakeCall: boolean = false;
  public inputNotifyData: any;
  public navigateMsg1 = '';
  public navigateMsg2 = '';

  @Output() public ignore: EventEmitter<undefined> = new EventEmitter();
  // @Input() set NotifyData(data) {
  //   this.notifyData = data;
  // };

  constructor(private http: HttpClient,
    public transferServices: TransferServices) {

  }

  public notifyData: any = {
    Type: "",
    CallerName: "UNkNown",
    CallerNo: "",
    Key: ""
  };
 

  public ignoreNotification(data: any): void {
    this.ignore.emit(data);
  }

  makeCallClick() {
    let url = Common.UrlLists.CallCenterAPI + "OrgExtNo=" + Common.currentUser.extentionNo + "&CallerName=" + Common.currentUser.userName + "&DestExtNo=" + this.notifyData.CallerNo;
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
        return error;
      })
    )
      .subscribe(
        getDial => {
          this.isMakeCall = true;
        }
      )
  }

  openOrderMng(type:string, key:string) {
    this.navigateMsg1 = '';
    this.navigateMsg2 = '';
      this.inputNotifyData = {
        type: type,
        key: key,
        isNotify: true
      }
      this.transferServices.callNotifyNavigation.next(this.inputNotifyData);
  }

}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class HomeComponent implements OnInit, OnDestroy {

  public extentionNo= '';
  public datePipe = new DatePipe("en-US");
  sidebarFlag: boolean = false;
  public userName = Common.currentUser.userName ? Common.currentUser.userName : "";
  public fullName = Common.currentUser.FirstName + "" + " " + Common.currentUser.LastName;
  public SegmentationTitle = Common.currentUser.SegmentationTitle ? Common.currentUser.SegmentationTitle : "";
  public SegmentationTypeName = Common.currentUser.SegmentationTypeName ? Common.currentUser.SegmentationTypeName : "";
  public currentVersion = Common.currentVersion;
  public ShowHome: boolean= false;
  public ShowNotification: boolean= false;
  public ShowAccount: boolean= false;
  public ShowUser: boolean= false;
  public ShowRole: boolean= false;
  public ShowModule: boolean= false;
  public ShowDownload: boolean= false;
  public ShowTracer: boolean= false;
  public ShowDesigner: boolean= false;
  public ShowSchedule: boolean= false;
  public ShowScheduleMng: boolean= false;
  public ShowOrder: boolean= false;
  public ShowAdmin: boolean= false;
  public ShowContentManagement: boolean= false;
  public showContext: boolean = false;
  public ShowSuspend: boolean = false;
  public ShowFrmBuilder: boolean = false;
  public ShowWorkflowDesigner: boolean = false;
  public ShowNewSchedule: boolean = false;
  public ShowSttDiscrepancy: boolean = false;
  public ShowReportsPortal: boolean = false;
  public ShowMonitoring: boolean = false;
  public isShowAlert: boolean = false;
  public ShowServiceCall: boolean = false;
  public ShowTeamManagement: boolean = false;
  public ShowHumanResourceManagement: boolean = false;
  public ShowOpening: boolean = false;
  public ShowPersonnelInfo: boolean = false;
  public ShowCompanySetup: boolean = false;
  public ShowBasicPrice: boolean = false;
  public ShowOperations: boolean = false;
  public ShowServicelineAndMethod: boolean = false;
  public ShowLocation: boolean = false;
  public ShowComplianceDefinition: boolean = false;
  public ShowSubManagement: boolean = false;
  public ShowMarketsAndStores: boolean = false;
  public ShowSaleAndScheduling: boolean = false;
  public ShowProcessManagement: boolean = false;
  public ShowRecieveAndPayment: boolean = false;
  public ShowARStatementManagement: boolean = false;
  public ShowAPStatementManagement: boolean = false;
  public ShowReconcile: boolean = false;
  public ShowVOC: boolean = false;
  public ShowPayroll: boolean = false;
  public ShowNoteManagement: boolean = false;
  public ShowInventory: boolean = false;
  public ShowEnterance: boolean = false;
  public ShowExit: boolean = false;
  public ShowBillOfLading: boolean = false;
  public ShowMaterialConfirmation: boolean = false;
  public ShowFlows: boolean = false;
  public ShowAdjustment: boolean = false;
  public ShowCounting: boolean = false;
  public ShowCorrection: boolean= false;
  public ShowPurchase: boolean= false;
  public ShowCreatePO: boolean= false;
  public ShowTabletManagement: boolean = false;
  public ShowEstimateRequest: boolean = false;
  public ShowPurchasableItems: boolean = false;
  public ShowInvoiceExpences: boolean = false;
  public ShowVendor: boolean = false;
  public ShowSubledgerManagement: boolean = false;
  public ShowNewTask: boolean = false;
  public ShowExpenseDefinition: boolean = false;
  public ShowStandardCosting: boolean = false;
  public ShowMaterialCosts: boolean = false;
  public ShowCostsChangeDocuments: boolean = false;
  public ShowTagsDefinition: boolean = false;
  public ShowSubAssignment: boolean = false;
  public ShowOfficeManagement: boolean = false;
  public ShowUnfinishedJobs: boolean = false;
  public ShowChecklistAnswers: boolean = false;
  public ShowChecklistDefinition: boolean = false;
  public ShowChecklistManagement: boolean = false;
  public ShowTimeAndAttendance: boolean = false;
  public ShowOrdersList: boolean = false;
  public ShowAROpenItems: boolean = false;
  public ShowAPOpenItems: boolean = false;
  public ShowInventoryItems: boolean = false;
  public ShowChargebackKinds: boolean = false;
  public ShowFunctions: boolean = false;
  public ShowCalendars: boolean = false;
  public ShowRegions: boolean = false;
  public ShowComplainSubjects: boolean = false;
  public ShowPoDownloadException: boolean = false;
  public isOpenWindowOrderMng: boolean = false;
  public orderNoClicked: string= '';
  public notifyData: any;
  public Subscription: Subscription| undefined;
  public Subscription1: Subscription| undefined;
  public Subscription2: Subscription| undefined;
  public Subscription3: Subscription| undefined;
  public destroyNotification: Subscription| undefined;
  public subscriptionNotifyNav: Subscription| undefined;
  public storeNoClicked= '';
  public installerNoClicked= '';
  public moreOrderClicked= '';
  public inputNotifyData: any;
  public officeInfoList: any;
  public N_notificationRef: NotificationRef| undefined;
  public N_notificationRef_miss: NotificationRef| undefined;
  public isShowContact: boolean = false;
  public isOpenWindowHome: boolean = false;
  public isOpenWindowBrowseOrdLst: boolean = false;
  public selectedData: any;
  public showListingContext: boolean = false;
  public customerNameVal= '';
  public phoneNoVal= '';
  public poNoVal= '';
  public windowTitle: string = "";
  public isShowPoSearch: boolean = false;
  public isOpenHelp: boolean = false;
  public RoleVal = '';
  public roleList: any = [];
  public isLoad: boolean = false;
  public isOpenCallhistory = false;
  public isAvailablityPunch: any;
  public punchSttValue: any;
  public punchTitle= '';
  public isOpenWindowOrderMngNav=false;
  public inputNotifyOrderData:any;
  public expandMode: PanelBarExpandMode = 0;
  public missCallCount= '';
  public alert = {
    type: '',
    msg: ''
  }
  public SegmentationTypeId = Common.currentUser.SegmentationTypeId;
  public notificationRef: NotificationRef| undefined;
  public moduleNameForWiki: string = '';
  public isOpenInstJobs:boolean=false;
  public InvoiceExpencesData = {
    type: 'Page'
  }


  public ngOnDestroy(): void {
    if (this.destroyNotification)
      this.destroyNotification.unsubscribe();
    else if (this.Subscription)
      this.Subscription.unsubscribe();
    else if (this.Subscription1)
      this.Subscription1.unsubscribe();
    else if (this.Subscription2)
      this.Subscription2.unsubscribe();
    else if (this.Subscription3)
      this.Subscription3.unsubscribe();
    else if(this.subscriptionNotifyNav)
      this.subscriptionNotifyNav.unsubscribe();
  }

  constructor(private authenticationService: AuthenticationService,
    private http: HttpClient, public bsModalRef: BsModalRef,
    public bsModalService: BsModalService,
    public transferServices: TransferServices,
    // public signalRService: SignalRService,
    private notificationService: NotificationService,
    private router: Router,
    private common: Common,
    private routeReuseStrategy: RouteReuseStrategy) { }

  onClick(event: any) {
    if (this.showListingContext) {
      if (event.toElement && event.toElement.innerText != "All Open Pos" &&
        event.toElement.innerText != "Pos having Concerns" &&
        event.srcElement.parentNode.className != "listing header-flaticon-speech-bubble" &&
        event.toElement.innerText != "Listing")
        this.showListingContext = false;
    }
    if (this.isShowPoSearch) {
      if (event.srcElement && event.srcElement.parentNode.innerText != "Phone#" &&
        event.srcElement.parentNode.innerText != "Customer Name" &&
        event.srcElement.parentNode.innerText != "PO#" &&
        event.toElement.innerText != "Search" &&
        event.srcElement.parentNode.className != "row site-header header-store-style" &&
        event.toElement.innerText != "PO Search" &&
        event.srcElement.parentNode.className != "PoSearch header-flaticon-speech-bubble")
        this.isShowPoSearch = false;
    }
    if (this.isShowContact) {
      if (event.toElement && event.toElement.innerText != "Contact Us" &&
        event.toElement.parentNode.classList[0] != "contact-us-box" &&
        event.srcElement.parentNode.className != "ContactUs header-flaticon-speech-bubble")
        this.isShowContact = false;
    }
    if (this.showContext) {
      if (event.toElement && event.toElement.innerText != "Change Password" &&
        event.srcElement.parentNode.className != "example-config")
        this.showContext = false
    }
  }

  ngOnInit() {
    this.extentionNo= Common.currentUser.extentionNo;
    this.GetLocalMisscallsCount();
    this.GetPunchAvailability();
    setInterval(() => {
      if (this.isAvailablityPunch)
        this.GetEmployeePunchStatus();
    }, 300000);
    this.GetRolesForUser();
    if (this.SegmentationTypeId == 4)
      this.GetStoreOfficeInfo();
    this.menuItemClick(this.SegmentationTypeId != 4 ? Common.currentUser.HomeModuleName : 'homeForStoreFlag');
    this.ShowNotification = Common.GetTruestee("mainMenu-Notification");
    this.ShowAccount = Common.GetTruestee("mainMenu-Account");
    this.ShowUser = Common.GetTruestee("mainMenu-UserManagement");
    this.ShowRole = Common.GetTruestee("mainMenu-RoleManagement");
    this.ShowModule = Common.GetTruestee("mainMenu-ModuleMng");
    this.ShowDownload = Common.GetTruestee("mainMenu-Download");
    this.ShowTracer = Common.GetTruestee("mainMenu-Tracer");
    this.ShowDesigner = Common.GetTruestee("mainMenu-Designer");
    this.ShowSchedule = Common.GetTruestee("mainMenu-Schedule");
    this.ShowScheduleMng = Common.GetTruestee("mainMenu-Schedule Management");
    this.ShowOrder = Common.GetTruestee("mainMenu-OrderMng");
    this.ShowAdmin = Common.GetTruestee("ICONXMMONITOR");
    this.ShowSuspend = Common.GetTruestee("SuspendTasks");
    this.ShowReportsPortal = Common.GetTruestee("ReportsPortal");
    this.ShowFrmBuilder = Common.GetTruestee("FormBuilder");
    this.ShowWorkflowDesigner = Common.GetTruestee("WorkflowDesigner");
    this.ShowNewSchedule = Common.GetTruestee("NewSchedule");
    this.ShowSttDiscrepancy = Common.GetTruestee("StatusDiscrepancy");
    this.ShowMonitoring = Common.GetTruestee("Monitoring");
    this.ShowServiceCall = Common.GetTruestee("ServiceCall");
    this.ShowTeamManagement = Common.GetTruestee("TeamManagement");
    this.ShowContentManagement = Common.GetTruestee("ContentManagement");
    this.ShowHumanResourceManagement = Common.GetTruestee("HumanResourceManagement");
    this.ShowOpening = Common.GetTruestee("Opening");
    this.ShowPersonnelInfo = Common.GetTruestee("PersonnelInfo");
    this.ShowCompanySetup = Common.GetTruestee("CompanySetup");
    this.ShowBasicPrice = Common.GetTruestee("BasicPrice");
    this.ShowOperations = Common.GetTruestee("Operations");
    this.ShowServicelineAndMethod = Common.GetTruestee("ServicelineAndMethod");
    this.ShowLocation = Common.GetTruestee("Location");
    this.ShowComplianceDefinition = Common.GetTruestee("ComplianceDefinition");
    this.ShowSubManagement = Common.GetTruestee("SubManagement");
    this.ShowMarketsAndStores = Common.GetTruestee("MarketsAndStores");
    this.ShowSaleAndScheduling = Common.GetTruestee("SaleAndScheduling");
    this.ShowProcessManagement = Common.GetTruestee("ProcessManagement");
    this.ShowRecieveAndPayment = Common.GetTruestee("RecieveAndPayment");
    this.ShowARStatementManagement = Common.GetTruestee("ARStatementManagement");
    this.ShowAPStatementManagement = Common.GetTruestee("APStatementManagement");
    this.ShowVOC = Common.GetTruestee("VoiceOfCustomer");
    this.ShowReconcile = Common.GetTruestee("Reconcile");
    this.ShowPayroll = Common.GetTruestee("Payroll");
    this.ShowNoteManagement = Common.GetTruestee("NoteManagement");
    this.ShowInventory = Common.GetTruestee("Inventory");
    this.ShowEnterance = Common.GetTruestee("Enterance");
    this.ShowExit = Common.GetTruestee("Exit");
    this.ShowBillOfLading = Common.GetTruestee("BillOfLading");
    this.ShowMaterialConfirmation = Common.GetTruestee("MaterialConfirmation");
    this.ShowFlows = Common.GetTruestee("Flows");
    this.ShowAdjustment = Common.GetTruestee("Adjustment");
    this.ShowCounting = Common.GetTruestee("Counting");
    this.ShowCorrection = Common.GetTruestee("Correction");
    this.ShowPurchase = Common.GetTruestee("Purchase");
    this.ShowCreatePO = Common.GetTruestee("CreatePO");
    this.ShowTabletManagement = Common.GetTruestee("TabletManagement");
    this.ShowEstimateRequest = Common.GetTruestee("EstimateRequest");
    this.ShowPurchasableItems = Common.GetTruestee("PurchasableItems");
    this.ShowInvoiceExpences = Common.GetTruestee("InvoiceExpences");
    this.ShowVendor = Common.GetTruestee("Vendor");
    this.ShowSubledgerManagement = Common.GetTruestee("SubledgerManagement");
    this.ShowNewTask = Common.GetTruestee("mainMenu-NewTaskMng");
    this.ShowExpenseDefinition = Common.GetTruestee("ExpenseDefinition");
    this.ShowStandardCosting = Common.GetTruestee("StandardCosting");
    this.ShowMaterialCosts = Common.GetTruestee("MaterialCosts");
    this.ShowCostsChangeDocuments = Common.GetTruestee("CostsChangeDocuments");
    this.ShowTagsDefinition = Common.GetTruestee("TagsDefinition");
    this.ShowSubAssignment = Common.GetTruestee("SubAssignment");
    this.ShowOfficeManagement = Common.GetTruestee("OfficeManagement");
    this.ShowUnfinishedJobs = Common.GetTruestee("UnfinishedJobs");
    this.ShowChecklistAnswers = Common.GetTruestee("ChecklistAnswers");
    this.ShowChecklistDefinition = Common.GetTruestee("ChecklistDefinition");
    this.ShowChecklistManagement = Common.GetTruestee("ChecklistManagement");
    this.ShowTimeAndAttendance = Common.GetTruestee("TimeAndAttendance");
    this.ShowOrdersList = Common.GetTruestee("OrdersList");
    this.ShowAROpenItems = Common.GetTruestee("AROpenItems");
    this.ShowAPOpenItems = Common.GetTruestee("APOpenItems");
    this.ShowInventoryItems = Common.GetTruestee("InventoryItems");
    this.ShowChargebackKinds = Common.GetTruestee("ChargebackKinds");
    this.ShowFunctions = Common.GetTruestee("Functions");
    this.ShowCalendars = Common.GetTruestee("Calendars");
    this.ShowRegions = Common.GetTruestee("Regions");
    this.ShowComplainSubjects = Common.GetTruestee("ComplainSubjects");
    this.ShowPoDownloadException = Common.GetTruestee("PoDownloadException");

    this.Subscription = this.transferServices.signalrAlertService.subscribe(
      (data: any) => {
        this.alert.type = data.type;
        this.alert.msg = data.msg;
        this.isShowAlert = data.flag;
      }
    );

    this.Subscription1 = this.transferServices.openOrderForHome.subscribe((data) => {
      this.inputNotifyData = data;
      this.isOpenWindowOrderMng = true;
    })

    this.destroyNotification = this.transferServices.signalRNewCallNotify.subscribe(
      (data: any) => {
        debugger
        let fltrDuplicate= Common.notificationRefArr.filter((p:any) => {
            p.content.instance.notifyData.CallId == data.CallId && 
            p.content.instance.notifyData.CallType == data.CallType
         });
        if(fltrDuplicate.length==0){
          if (Common.currentUser.extentionNo == data.TargetExtension) {
            if (data.CallType == "INCOMINGCALL") {
              this.notifyData = data;
              let arr = Common.notificationRefArr.filter((p: any) => p.content.instance.notifyData.CallId == data.CallId)
              if (arr.length > 0) {
                this.N_notificationRef = arr[0];
              }
              else {
                let filterArrIncoming = Common.notificationRefArr.filter((p: any) => p.content.instance.notifyData.CallType == "INCOMINGCALL");
                if (filterArrIncoming.length > 0 && filterArrIncoming[0].content)
                  filterArrIncoming[0].content.instance.notifyData = data;
                else {
                  this.N_notificationRef = this.notificationService.show({
                    content: NotificationCallComponent,
                    position: { horizontal: 'right', vertical: 'top' },
                    animation: { type: 'fade', duration: 500 },
                    closable: false,
                    hideAfter: 31536000000,
                    type: { style: 'info', icon: false }
                  });
                }
                if(this.N_notificationRef && this.N_notificationRef.content){
                  this.N_notificationRef.content.instance.notifyData = data;
                  Common.notificationRefArr.push(this.N_notificationRef);
                }
              }
            } else if (data.CallType == "ANSWERED" || data.CallType == "HANGUP" || data.CallType == "MISSCALL") {
              let filterArr = Common.notificationRefArr.filter((p: any) => p.content.instance.notifyData.CallId == data.CallId);
              if (filterArr.length > 0) {
                if (data.CallType == "ANSWERED" || data.CallType == "MISSCALL") {
  
                  if (data.CallType == "MISSCALL") {
                    this.missCallCount = data.MissCallCount;
                    let filterArrMiss = Common.notificationRefArr.filter((p: any) => p.content.instance.notifyData.CallType == "MISSCALL");
                    if (filterArr[0].content && filterArrMiss[0].content && filterArrMiss.length > 0) {
                      filterArr[0].content.instance.notifyData.CallType = "MISSCALL";
                      filterArrMiss[0].content.instance.notifyData = filterArr[0].content.instance.notifyData;
                      let indx = Common.notificationRefArr.indexOf(filterArr[0]);
                      Common.notificationRefArr.splice(indx, 1);
                      filterArr[0].hide();
                    } else if(filterArr[0].content)
                      filterArr[0].content.instance.notifyData.CallType = data.CallType;
                  } else{
                    let filterArrAnswered = Common.notificationRefArr.filter((p: any) => p.content.instance.notifyData.CallType == "ANSWERED");
                    if (filterArrAnswered[0].content && filterArr[0].content && filterArrAnswered.length > 0){
                      filterArr[0].content.instance.notifyData.CallType = "ANSWERED";
                      filterArrAnswered[0].content.instance.notifyData = filterArr[0].content.instance.notifyData;
                      let indx = Common.notificationRefArr.indexOf(filterArr[0]);
                      Common.notificationRefArr.splice(indx, 1);
                      filterArr[0].hide();
                    } 
                    else if(filterArr[0].content)
                      filterArr[0].content.instance.notifyData.CallType = data.CallType;
                  }
                }
                if (data.CallType == "HANGUP") {
                  filterArr[0].hide();
                  let filterHANGUP = Common.notificationRefArr.filter((p: any) => p.content.instance.notifyData.CallId == data.CallId);
                  let indx = Common.notificationRefArr.indexOf(filterHANGUP[0]);
                  Common.notificationRefArr.splice(indx, 1);
                }
              }
            }
          }

          if (this.N_notificationRef && this.N_notificationRef.content) {
            this.N_notificationRef.content.instance.ignore.subscribe((data: any) =>{
              let fltr= Common.notificationRefArr.filter((x: any)=> x.content.instance.notifyData.CallId== data.CallId && x.content.instance.notifyData.CallType== data.CallType);
              if(fltr.length>0){
                let indx = Common.notificationRefArr.indexOf(fltr[0]);
                console.log('Before Remove', Common.notificationRefArr);
                if (indx > -1)
                  Common.notificationRefArr[indx].hide();
                  Common.notificationRefArr.splice(indx, 1);
                  console.log('After Remove', Common.notificationRefArr);
                  console.log('Data Remove', this.N_notificationRef);
              } 
            }
            );
          }

          console.log('END',Common.notificationRefArr);
        }
      }
    );
    this.subscriptionNotifyNav = this.transferServices.callNotifyNavigation.subscribe(
      (data:any)=>{
        this.inputNotifyOrderData= data;
        if(data.type=='installer')
          this.isOpenInstJobs=true;
        else
          this.isOpenWindowOrderMngNav=true;
    });
  }


  public itemClicked: string= '';
  menuItemClick(item: string) {
    Common.selectedMenuItems = item;
    this.itemClicked = item;
    if (item == 'Home' || item == 'homeForStoreFlag')
      this.moduleNameForWiki = '';
    else
      this.moduleNameForWiki = item;
    if(item=='ARStatementManagement' || item=='APStatementManagement')
      this.transferServices.reloadSttmntMng.next('');
  }

  getRequestId() {
    this.common.CallGetApi(this.http, Common.UrlLists.GetRequestId + Common.currentUser.UserId + "&Userkey=" + Common.currentUser.ProviderUserKey)
    .pipe(
      catchError((error) => {
        console.log("error", error.message);
        return error;
      })
    )
      .subscribe(getRequest => {
        Common.requestId = getRequest;
        this.menuItemClick('mainMenu-Schedule');
      })
  }

  scheduleClick() {
    this.getRequestId();

  }

  logoutEvent() {
    this.authenticationService.logout();
  }

  sideMenuActions() {
    this.sidebarFlag = !this.sidebarFlag;
    if (this.sidebarFlag) {
      var element = document.getElementById("panelbar");
      element?.classList.add("showPanelbar");
    }
    else {
      var element = document.getElementById("panelbar");
      element?.classList.add("hidePanelbar");
    }
  }

  public onToggle(): void {
    this.showContext = !this.showContext;
  }

  changePassword() {
    this.showContext= false;
    const modalConfigDefaults: ModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const initialState = {
    };
    // this.bsModalRef = this.bsModalService.show(ModalChangePasswordComponent, Object.assign({ initialState }, modalConfigDefaults, { class: 'customClass' })
    // );
  }

  detectmob() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  closeWindowOrderMng() {
    this.isOpenWindowOrderMng = false;
  }

  GetStoreOfficeInfo() {
    this.common.CallGetApi(this.http, Common.UrlLists.GetStoreOfficeInfo + "StoreCode=" + Common.currentUser.SegmentationCode)
    .pipe(
      catchError((error) => {
        console.log("Get Store Office Info ERROR : ", error.error);
        return error;
      })
    )
      .subscribe(getData => {
        this.officeInfoList = getData;
      })
  }

  contactUsClick() {
    this.isShowContact = !this.isShowContact;
  }

  closeWindowHome() {
    this.isOpenWindowHome = false;
  }

  homeClick() {
    this.showListingContext= false;
    this.isOpenWindowHome = true;
  }

  closeWindowBrowseOrdLst() {
    this.isOpenWindowBrowseOrdLst = false;
  }

  browseOrderListClick() {
    this.showListingContext= false;
    this.selectedData = {
      selectedOrderStatus: null,
      selectedMaterialStatus: null,
      selectedCustomerName: null,
      selectedPoNo: null,
      selectedPhoneNo: null
    }
    this.windowTitle = "";
    this.isOpenWindowBrowseOrdLst = true;
  }

  listingClick() {
    this.showListingContext = !this.showListingContext;
  }

  poSearchClick() {
    this.isShowPoSearch = !this.isShowPoSearch;
  }

  searchClick() {
    this.isShowPoSearch= false;
    this.selectedData = {
      selectedOrderStatus: null,
      selectedMaterialStatus: null,
      selectedCustomerName: this.customerNameVal ? this.customerNameVal : null,
      selectedPoNo: this.poNoVal ? this.poNoVal : null,
      selectedPhoneNo: this.phoneNoVal ? this.phoneNoVal : null
    }
    let str = " for ";
    if (this.customerNameVal)
      str += "customer Name " + this.customerNameVal;
    if (this.poNoVal)
      str += " PO# " + this.poNoVal;
    if (this.phoneNoVal)
      str += " Phone# " + this.phoneNoVal;
    this.windowTitle = str;
    this.isOpenWindowBrowseOrdLst = true;

  }

  onHelp() {
    this.isOpenHelp = true;;
  }

  closeHelp() {
    this.isOpenHelp = false;
  }

  onWikiHelp() {

  }

  onMouseOver(falg: boolean) {
    this.sidebarFlag = falg;
  }

  GetRolesForUser() {
    this.common.CallGetApi(this.http, Common.UrlLists.GetRolesForUser + Common.currentUser.userName)
    .pipe(
      catchError((error) => {
        console.log("Get Roles For User ERROR : ", error.error);
        return error;
      })
    )
      .subscribe(getData => {
        getData.forEach((element: any) => {
          if (element.IsSelected)
            this.roleList.push(element);
        });
        this.RoleVal = Common.currentUser.RoleIds[0];
      })
  }

  onChangeRole(e: any) {
    this.isLoad = true;
    let roleId = e.currentTarget.value;
    let roleName = e.target.selectedOptions[0].innerText;
    this.common.CallGetApi(this.http, Common.UrlLists.GetSegmentationByRole +
      "userId=" + Common.currentUser.UserKey + "&RoleId=" + e.currentTarget.value)
      .pipe(
        catchError((error) => {
          console.log("Get Segmentation By Role ERROR : ", error.error);
        this.isLoad = false;
          return error;
        })
      )
      .subscribe(getData => {
        if (getData.m_SegmentationModel) {
          Common.currentUser.RoleIds[0] = roleId;
          Common.currentUser.Roles[0] = roleName;
          Common.currentUser.SegmentationTypeId = getData.m_SegmentationModel.m_SegmentationTypeId;
          Common.currentUser.SegmentationTypeName = getData.m_SegmentationModel.m_SegmentationTypeName;
          Common.currentUser.SegmentationId = getData.m_SegmentationModel.m_SegmentationID;
          Common.currentUser.SegmentationTitle = getData.m_SegmentationModel.m_SegmentationTitle;
          Common.currentUser.SegmentationCode = getData.m_SegmentationModel.m_SegmentationCode;
          this.GetAssignApplicationModule(roleId);
        } else {
          Common.currentUser.RoleIds[0] = roleId;
          Common.currentUser.Roles[0] = roleName;
          this.GetAssignApplicationModule(roleId);
        }
      })
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate([currentUrl]);
    this.isLoad = false;
  }

  GetAssignApplicationModule(roleid: string) {
    this.common.CallGetApi(this.http, Common.UrlLists.GetAssignApplicationModule +
      "roleid=" + roleid)
      .pipe(
        catchError((error) => {
          console.log("Get Assign Application Module ERROR : ", error.error);
          return error;
        })
      )
      .subscribe(getData => {
        Common.currentUser.AssignApplicationModules = getData.m_ApplicationModuleModel;
        this.reloadComponent();
      })
  }

  onCallHistory() {
    this.isOpenCallhistory = true;
  }

  onCloseCallHistory() {

    this.isOpenCallhistory = false
  }

  GetEmployeePunchStatus() {
    this.common.CallGetApi(this.http, Common.UrlLists.GetEmployeePunchStatus +
      'PersonnelNo=' + Common.currentUser.personalId +
      '&Date=' + this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'))
      .pipe(
        catchError((error) => {
          console.log("Get Employee Punch Status ERROR : ", error.error);
          return error;
        })
      )
      .subscribe(getData => {
        this.punchSttValue = getData[0];
        if (getData[0].Punchedin == 0)
          this.punchTitle = 'Punch In';
        else
          this.punchTitle = 'Punch Out';
      })
  }

  onPunchBtn(type: string) {
    let url;
    let body;
    if (type == 'Punch In'){
      url = Common.UrlLists.EmployeePunchIn;
      body = {
        "PersonnelNo": Common.currentUser.personalId,
        "PunchedIn_DateTime": this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
        "Auto": 0
      }
    }
    else{
      url = Common.UrlLists.EmployeePunchOut;
      body = {
        "PersonnelNo": Common.currentUser.personalId,
        "PunchedOut_DateTime": this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
        "Auto": 0
      }
    }

    this.common.CallPostApi(this.http, url, body)
    .pipe(
      catchError((error) => {
        console.log("Get Employee Punch In ERROR : ", error.error);
        return error;
      })
    )
      .subscribe(getData => {
        this.GetEmployeePunchStatus();
      })
  }

  GetPunchAvailability() {
    this.common.CallGetApi(this.http, Common.UrlLists.GetPunchAvailability +
      'PersonnelNo=' + Common.currentUser.personalId)
      .subscribe((getData) => {
        this.isAvailablityPunch=getData[0];
        if(getData[0]){
          this.GetEmployeePunchStatus();
        }
      }, error => {
        console.log("Get Punch Availability ERROR : ", error.message);
      })
  }

  GetLocalMisscallsCount(){
    this.common.CallGetApi(this.http, Common.UrlLists.GetLocalMisscallsCount +
      'ExtNo=' + Common.currentUser.extentionNo)
      .pipe(
        catchError((error) => {
          console.log("Get Local Misscalls Count ERROR : ", error.message);
          return error;
        })
      )
      .subscribe((count) => {
        this.missCallCount=count;
      })
  }

}