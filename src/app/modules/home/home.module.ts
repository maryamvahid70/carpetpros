
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PopupModule } from '@progress/kendo-angular-popup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { NotificationService } from '@progress/kendo-angular-notification';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelBarModule } from '@progress/kendo-angular-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AgGridModule } from 'ag-grid-angular';

import { HomeComponent } from '../home/home.component';
import { WikiHelpComponent } from '../home/help/wiki-help.component';
import { HomePageComponent } from '../home/home-page/home-page.component';
import { ModalCallHistoryComponent } from './modal-call-history';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [
    HomeComponent,
    WikiHelpComponent,
    HomePageComponent,
    ModalCallHistoryComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    PopupModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    WindowModule,
    ButtonsModule,
    BrowserModule,
    BrowserAnimationsModule,
    PanelBarModule,
    MatDatepickerModule,
    AgGridModule,
    SharedModule
  ],
  providers: [
    NotificationService,
    MatDatepickerModule
  ],
  exports: [
    MatFormFieldModule,
    MatDatepickerModule
  ]
})
export class HomeModule {}