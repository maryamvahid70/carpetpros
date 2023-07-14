import { Component, OnInit } from '@angular/core';
import { Common } from 'src/app/app.component';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  public homePageBtnLst1: any;
  public homePageBtnLst2: any;
  public isOpenOrdersLst = false;
  public orderLstData: any = {};
  public isLoad: boolean = false;
  public taskDataForNav: any;
  public isOpentaskssLst: boolean = false;
  public vars: string =
    'StoreCode=&ServicelineCode=&OfficeCode=&DomainCode=&SubId=&TeamNo=';
  public btnSummaryLst: any;
  public infoSummaryLst: any;
  public oldSelectedEl: string = '';

  constructor(private http: HttpClient, private common: Common) {}

  ngOnInit() {
    this.GetNewHomePageButtons();
  }

  GetNewHomePageButtons() {
    this.isLoad = true;
    let body = {};
    if (Common.currentUser.SegmentationTypeId == 1)
      this.vars =
        'StoreCode=&ServicelineCode=&OfficeCode=&DomainCode=&SubId=' +
        Common.currentUser.SegmentationCode +
        '&TeamNo=';
    else if (Common.currentUser.SegmentationTypeId == 2)
      this.vars =
        'StoreCode=&ServicelineCode=&OfficeCode=&DomainCode=&SubId=&TeamNo=' +
        Common.currentUser.SegmentationCode;
    else if (Common.currentUser.SegmentationTypeId == 4)
      this.vars =
        'StoreCode=' +
        Common.currentUser.SegmentationCode +
        '&ServicelineCode=&OfficeCode=&DomainCode=&SubId=&TeamNo=';
    else if (Common.currentUser.SegmentationTypeId == 5)
      this.vars =
        'StoreCode=&ServicelineCode=' +
        Common.currentUser.SegmentationCode +
        '&OfficeCode=&DomainCode=&SubId=&TeamNo=';
    else if (Common.currentUser.SegmentationTypeId == 7)
      this.vars =
        'StoreCode=&ServicelineCode=&OfficeCode=' +
        Common.currentUser.SegmentationCode +
        '&DomainCode=&SubId=&TeamNo=';
    else if (Common.currentUser.SegmentationTypeId == 8)
      this.vars =
        'StoreCode=&ServicelineCode=&OfficeCode=&DomainCode=' +
        Common.currentUser.SegmentationCode +
        '&SubId=&TeamNo=';

    this.common
      .CallPostApi(
        this.http,
        Common.UrlLists.GetNewHomePageButtons + this.vars,
        body
      )
      .pipe(
        catchError(error => {
          console.log('Get New Home Page Buttons ERROR: ', error.error);
          this.isLoad = false;
          return error;
        })
      )
      .subscribe(getData => {
        this.onClickTaskBtn(getData[0]);
        this.homePageBtnLst1 = getData.filter((x: any) => x.Section == 1);
        this.homePageBtnLst2 = getData.filter((x: any) => x.Section == 2);
        this.isLoad = false;
      });
  }

  onlickBtns(item: any) {
    this.orderLstData = item;
    this.isOpenOrdersLst = true;
  }

  onClickTaskBtn(item: any) {
    this.isLoad = true;
    if (document.getElementById(item.ButtonCaption)) {
      document
        .getElementById(item.ButtonCaption)
        ?.classList.add('selected-box');
      if (this.oldSelectedEl != '')
        document
          .getElementById(this.oldSelectedEl)
          ?.classList.remove('selected-box');
    }
    this.oldSelectedEl = item.ButtonCaption;
    let body = {};
    this.common
      .CallPostApi(
        this.http,
        Common.UrlLists.GetNewHomePageButtonSummary +
          'ButtonName=' +
          item.ButtonCaption +
          '&AccountReceivable=&' +
          this.vars,
        body
      )
      .pipe(
        catchError(error => {
          console.log('Get New Home Page Buttons ERROR: ', error.error);
          return error;
        })
      )
      .subscribe(data => {
        data.ButtonCaption = item.ButtonCaption;
        data.forEach((element: any) => {
          element.API_Input = item.API_Input;
        });
        this.btnSummaryLst = data;
        this.isLoad = false;
        if (this.oldSelectedEl == '')
          document
            .getElementById(data[0].ButtonCaption)
            ?.classList.add('selected-box');
      });

    this.common
      .CallPostApi(
        this.http,
        Common.UrlLists.GetNewHomePageInfoSummary +
          'ButtonName=' +
          item.ButtonCaption +
          '&' +
          this.vars,
        body
      )
      .pipe(
        catchError(error => {
          console.log('Get New Home Page Info Summary ERROR: ', error.error);
          this.isLoad = false;
          return error;
        })
      )
      .subscribe(data => {
        this.infoSummaryLst = data;
      });
  }

  onClickBtnsSummary(item: any) {
    this.taskDataForNav = item;
    this.isOpentaskssLst = true;
  }
}
