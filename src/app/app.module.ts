import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, Common } from './app.component';
import { AuthGuard } from './_guards/auth.guard';
import { AccountModule } from './modules/account/account.module';
import { AppConfigService } from './app-config.service';
import { TransferServices } from './general/services/config.service';
import { HomeModule } from './modules/home/home.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AccountModule,
    HomeModule
  ],
  providers: [
    AuthGuard,
    AppConfigService,
    Common,
    TransferServices,
    {
      provide: APP_INITIALIZER,
      deps: [AppConfigService],
      multi: true,
      useFactory: (appConfigService: AppConfigService) => {
        return () =>
          appConfigService
            .loadAppConfig()
            .pipe(tap(config => appConfigService.setAppConfig(config)));
      },
    },
  ],
  bootstrap: [AppComponent],
  exports: [ 
    
  ]
})
export class AppModule { }
