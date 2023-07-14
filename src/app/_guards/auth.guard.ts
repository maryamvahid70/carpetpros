import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Common } from '../app.component';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        public router: Router,
        public http: HttpClient) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (Common.currentUser) {
            return true;
        }else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }

}