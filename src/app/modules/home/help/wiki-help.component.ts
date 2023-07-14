import { Component, OnInit, Input } from '@angular/core';
import { Common } from 'src/app/app.component';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-wiki-help',
  template: `
    <i class="flaticon-question" title="Help" (click)="onWikiHelp()"></i>
  `,
  styles: [
    `
      .flaticon-question {
        right: 90px;
        position: absolute;
        top: 3px;
        cursor: pointer;
      }
    `,
  ],
})
export class WikiHelpComponent implements OnInit {
  @Input('data') moduleName: any;

  ngOnInit() {}

  constructor(private http: HttpClient, private common: Common) {}

  onWikiHelp() {
    this.common
      .CallGetApi(
        this.http,
        Common.UrlLists.GetModuleWikiURL + 'ModuleName=' + this.moduleName
      )
      .pipe(
        catchError(error => {
          console.log('Get Module Wiki URL ERROR : ', error);
          return error;
        })
      )
      .subscribe(getData => {
        window.open(
          Common.UrlLists.BaseUrlWiki + getData,
          '_blank',
          'width=1200,height=700,top=50%,left=50%'
        );
      });
  }
}
