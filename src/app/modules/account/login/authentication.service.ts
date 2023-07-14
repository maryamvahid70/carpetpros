import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Common } from 'src/app/app.component';
import { Router } from '@angular/router';
@Injectable()

export class AuthenticationService {
    constructor(private http: HttpClient,
        private router: Router,
        private common:Common) { }
    login(username: string, password: string) {
        let body = {
            "UserName": username,
            "password": password,
            "ClientVersion": Common.currentVersion,
            "ApplicationName": "Task Manager"
        }
          return this.common.CallPostApi(this.http,Common.UrlLists.login,body);
    }
    logout() {
        // localStorage.removeItem('currentUser');
        Common.currentUser=null;
        this.router.navigate(['/login']);
    }
}