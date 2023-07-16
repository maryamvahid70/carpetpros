import { NgModule } from '@angular/core';
import { CpAlertComponent } from './general/cp-alert.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    CpAlertComponent
  ],
  imports: [
    AlertModule.forRoot(),
  ],
  providers: [],
  bootstrap: [],
  exports: [ 
    CpAlertComponent
  ]
})
export class SharedModule { 
    static forRoot() {
        // Forcing the whole app to use the returned providers from the AppModule only.
        return {
          ngModule: SharedModule,
          providers: [
            /* All of your services here. It will hold the services needed by `itself`. */
          ],
        };
      }
}
