import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationService, NotificationRef } from '@progress/kendo-angular-notification';
// import { ConfigService } from 'ngx-envconfig';
import * as CryptoJS from 'crypto-js';
import { ServicesLst } from './general/services/services-address';
import { AppConfigService } from 'src/app/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {

    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker('./web-worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }

  }

  constructor(
    // private configService: ConfigService
    ) {
     //Common.UrlLists = configService.get('UrlList');
    // Common.currentVersion = configService.get('currentVersion');
    // Common.ColDef = configService.get('ColDef');
  }

}
@Injectable()
export class Common {
  public static Password: string;
  public static currentUser: any;
  public static requestId: string;
  public static Tocken: string;
  public static formatDate: string = 'MM-dd-yy';
  public static formatDateTime: string = 'MM-dd-yy-HH:mm';
  public static GoogleAPIKey = "AIzaSyA2x-ZK664WDrgXjzvirRdrB6IvC3HiTQQ";
  public static selectedMemberNo:string;
  public static selectedComplianceId:string;
  public static currentVersion = '1.1.1.80';
  public static UrlLists:any= ServicesLst.apiAddress;
  public static selectedMenuItems: string;
  public static notificationRefArr: Array<NotificationRef> = [];
  public static ColDef:any= ServicesLst.ColDef;
  public static selectedRequirementNos: Array<string> = [];
  public static GetTruestee(appmoduleName:string) {
    var isexist = this.currentUser.AssignApplicationModules.find((x:any) => x.ModuleName == appmoduleName)
    if (isexist != undefined)
      return true;
    else
      return false;
  }

  constructor(
    private config:AppConfigService){}

  public static GetTruesteeJson(dataTruesteeArr:Array<string>) {
    let result;
    let strJson = '{';
    dataTruesteeArr.forEach((element:string) => {
      let isexist = this.currentUser.AssignApplicationModules.find((x:any) => x.ModuleName == element)
      if (isexist != undefined)
        result = true;
      else
        result = false;
      strJson += '"' + element + '": { "Result" : ' + result + '},';
    });
    strJson = strJson.substring(0, strJson.length - 1);
    strJson += '}';

    return JSON.parse(strJson);

  }

  public static getColDefByGridId(gridId:string) {
    if (Common.ColDef[gridId])
      return Common.ColDef[gridId];
    return null;
  }

  public CallPostApi(http: HttpClient, customUrl: string, apiBody: any, 
    BaseUrl = this.config.getAddress('BaseUrl')){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': Common.Tocken
      })
    };
    return http.post<any>(BaseUrl + customUrl, apiBody, httpOptions);
  }

  public static CallPostApi1(mybaseUrl:string, http: HttpClient, apiBody: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return http.post<any>(mybaseUrl, apiBody, httpOptions);
  }

  public CallGetApi(http: HttpClient, customUrl: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': Common.Tocken
      })
    };
    return http.get<any>(this.config.getAddress('BaseUrl') + customUrl, httpOptions);
  }

  public CallGetApiWithoutTocken(http: HttpClient, customUrl: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return http.get<any>(this.config.getAddress('BaseUrl') + customUrl, httpOptions);
  }

  public static getEncrypted(msg: string) {

    let utcDateTime = 'HfE@sO$WvNOG$V5NeKI3x';
    if (msg == null)
      msg = '';
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(utcDateTime, salt, {
      keySize: keySize / 32,
      iterations: 100
    });
    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    var encrypted = CryptoJS.AES.encrypt(msg.toString(), key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
    return result;

  }

}

