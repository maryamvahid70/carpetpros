
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

import { HomeComponent } from '../home/home.component';
import { WikiHelpComponent } from '../home/help/wiki-help.component';


@NgModule({
  declarations: [
    HomeComponent,
    WikiHelpComponent
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
    PanelBarModule
  ],
  providers: [
    NotificationService
  ],
  exports: [
    MatFormFieldModule,
  ]
})
export class HomeModule {}